import { createClient, type RealtimeChannel, type SupabaseClient } from '@supabase/supabase-js';
import { parseReleaseRecord, type ReleaseRecord } from './release-state.ts';

type Config = { url: string; publishableKey: string; channel: 'production' | 'test' };

/** Read one public release row; a broadcast is a signal to read, not data to trust. */
export function watchRelease(
  config: Config,
  onRecord: (record: ReleaseRecord | null) => void
): () => void {
  if (!config.url || !config.publishableKey) {
    queueMicrotask(() => onRecord(null));
    return () => undefined;
  }
  let client: SupabaseClient;
  try {
    const url = new URL(config.url);
    if (url.protocol !== 'https:' && url.hostname !== 'localhost')
      throw new Error('Invalid release URL');
    client = createClient(config.url, config.publishableKey, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
  } catch {
    queueMicrotask(() => onRecord(null));
    return () => undefined;
  }
  let active = true;
  let channel: RealtimeChannel | null = null;
  let pending = false;
  let reread = false;
  let lastReadAt = 0;
  let backoff = 1000;
  let retry: number | undefined;

  const read = async (force = false): Promise<void> => {
    if (!active) return;
    if (pending) {
      if (force) reread = true;
      return;
    }
    if (!force && Date.now() - lastReadAt < 60_000) return;
    pending = true;
    lastReadAt = Date.now();
    try {
      const { data, error } = await client
        .from('latest_app_releases')
        .select('version,severity,reason,min_native_version')
        .eq('platform', 'docs')
        .eq('channel', config.channel)
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      if (active) onRecord(parseReleaseRecord(data));
    } catch {
      // A saved normal notice still blocks on the next start when offline.
      if (active) onRecord(null);
    } finally {
      pending = false;
      if (reread && active) {
        reread = false;
        void read(true);
      }
    }
  };

  const join = (): void => {
    if (!active) return;
    if (channel) void client.removeChannel(channel);
    const next = client
      .channel(`releases:docs:${config.channel}`)
      .on('broadcast', { event: 'release' }, () => void read(true));
    channel = next;
    next.subscribe((status) => {
      if (!active) return;
      if (channel !== next) return;
      if (status === 'SUBSCRIBED') {
        backoff = 1000;
        void read(true);
      } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
        channel = null;
        void client.removeChannel(next);
        if (!retry) {
          retry = window.setTimeout(() => {
            retry = undefined;
            join();
          }, backoff);
          backoff = Math.min(backoff * 2, 30_000);
        }
      }
    });
  };
  const onVisible = (): void => {
    if (document.visibilityState === 'visible') void read();
  };
  const onOnline = (): void => {
    void read(true);
    if (!channel && !retry) join();
  };
  void read(true);
  join();
  document.addEventListener('visibilitychange', onVisible);
  window.addEventListener('focus', onVisible);
  window.addEventListener('online', onOnline);
  return () => {
    active = false;
    document.removeEventListener('visibilitychange', onVisible);
    window.removeEventListener('focus', onVisible);
    window.removeEventListener('online', onOnline);
    if (retry) window.clearTimeout(retry);
    if (channel) void client.removeChannel(channel);
  };
}
