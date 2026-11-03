import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { translate } from '@docusaurus/Translate';
import { watchRelease } from '../../lib/release-feed';
import {
  decideRelease,
  compareSemver,
  type ReleaseDecision,
  type ReleaseRecord,
} from '../../lib/release-state.ts';
import { readReleaseNotice, writeReleaseNotice } from '../../lib/release-storage';
import styles from './styles.module.css';

const RUN_ID = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
const RELEASE_URL = 'https://github.com/aoneahsan/windowsweep/releases';
const SUPPORT_URL = 'https://github.com/aoneahsan/windowsweep/issues';

type ReleaseConfig = {
  version: string;
  channel: 'production' | 'test';
  url: string;
  publishableKey: string;
};

function configFromSite(fields: Record<string, unknown>): ReleaseConfig {
  return {
    version: typeof fields.releaseVersion === 'string' ? fields.releaseVersion : '',
    channel: fields.releaseChannel === 'test' ? 'test' : 'production',
    url: typeof fields.supabaseUrl === 'string' ? fields.supabaseUrl : '',
    publishableKey:
      typeof fields.supabasePublishableKey === 'string' ? fields.supabasePublishableKey : '',
  };
}

/** Register after hydration; a newly active worker reloads the read-only docs page. */
function useSelfUpdate(): { check: () => Promise<void>; update: () => Promise<void> } {
  const registration = useRef<ServiceWorkerRegistration | null>(null);
  const reloading = useRef(false);
  const lastCheck = useRef(0);
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    const onControllerChange = (): void => {
      if (reloading.current) return;
      reloading.current = true;
      window.location.reload();
    };
    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);
    requestAnimationFrame(() => {
      void navigator.serviceWorker
        .register('/sw.js')
        .then((value) => {
          registration.current = value;
        })
        .catch(() => undefined);
    });
    const onVisible = (): void => {
      if (document.visibilityState !== 'visible' || Date.now() - lastCheck.current < 60_000) return;
      lastCheck.current = Date.now();
      void registration.current?.update();
    };
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', onVisible);
    window.addEventListener('online', onVisible);
    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', onVisible);
      window.removeEventListener('online', onVisible);
    };
  }, []);

  const check = useCallback(async () => {
    if (registration.current) {
      await registration.current.update();
      registration.current.waiting?.postMessage({ type: 'SKIP_WAITING' });
    }
  }, []);
  const update = useCallback(async () => {
    await check();
    window.location.reload();
  }, [check]);
  return { check, update };
}

function useReleaseDecision(
  config: ReleaseConfig,
  checkWorker: () => Promise<void>
): {
  decision: ReleaseDecision;
  dismiss: () => void;
} {
  const [decision, setDecision] = useState<ReleaseDecision>({ kind: 'none' });
  const [record, setRecord] = useState<ReleaseRecord | null>(null);

  useEffect(
    () =>
      watchRelease(
        { url: config.url, publishableKey: config.publishableKey, channel: config.channel },
        (next) => {
          setRecord(next);
          if (next) void checkWorker();
        }
      ),
    [config.url, config.publishableKey, config.channel, checkWorker]
  );

  useEffect(() => {
    const stored = readReleaseNotice();
    let next = decideRelease({ running: config.version, record, stored, runId: RUN_ID });
    if (
      next.kind === 'none' &&
      stored &&
      record &&
      compareSemver(config.version, record.version)! >= 0
    ) {
      writeReleaseNotice(null);
    }
    if (next.kind === 'notice' && (!stored || stored.version !== next.release.version)) {
      writeReleaseNotice({
        version: next.release.version,
        reason: next.release.reason,
        runId: RUN_ID,
        storedAt: new Date().toISOString(),
        dismissed: false,
      });
      next = decideRelease({
        running: config.version,
        record,
        stored: readReleaseNotice(),
        runId: RUN_ID,
      });
    }
    setDecision(next);
  }, [config.version, record]);

  const dismiss = (): void => {
    const stored = readReleaseNotice();
    if (stored && decision.kind === 'notice') {
      writeReleaseNotice({ ...stored, dismissed: true });
      setDecision({ ...decision, dismissed: true });
    }
  };
  return { decision, dismiss };
}

/** Docs release notice and block, using the same record decision as the desktop app. */
export default function ReleaseGate({ children }: { children: ReactNode }) {
  const { siteConfig } = useDocusaurusContext();
  const config = configFromSite(siteConfig.customFields ?? {});
  const { check, update } = useSelfUpdate();
  const { decision, dismiss } = useReleaseDecision(config, check);
  const [working, setWorking] = useState(false);
  const [failed, setFailed] = useState(false);
  const updateButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (decision.kind !== 'block') return;
    const nodes = document.querySelectorAll<HTMLElement>('header, main, footer, aside');
    const previous = Array.from(nodes, (node) => [node, node.inert] as const);
    nodes.forEach((node) => {
      node.inert = true;
    });
    updateButton.current?.focus();
    return () =>
      previous.forEach(([node, inert]) => {
        node.inert = inert;
      });
  }, [decision.kind]);

  const doUpdate = async (): Promise<void> => {
    setWorking(true);
    setFailed(false);
    try {
      await update();
    } catch {
      setFailed(true);
      setWorking(false);
    }
  };

  return (
    <>
      {children}
      {decision.kind === 'notice' && !decision.dismissed && (
        <section className={styles.notice} role="status" aria-live="polite">
          <div>
            <strong>
              {translate(
                { id: 'release.notice.title', message: 'Version {version} is ready' },
                { version: decision.release.version }
              )}
            </strong>
            <p>
              {translate({
                id: 'release.notice.body',
                message: 'This update is required from your next visit.',
              })}{' '}
              {decision.release.reason}
            </p>
          </div>
          <div className={styles.actions}>
            <button
              className="button button--primary"
              type="button"
              onClick={() => void doUpdate()}
              disabled={working}
            >
              {translate({ id: 'release.notice.update', message: 'Update now' })}
            </button>
            <button className="button button--secondary" type="button" onClick={dismiss}>
              {translate({ id: 'release.notice.later', message: 'Later' })}
            </button>
          </div>
          {failed && (
            <div className={styles.failure} role="alert">
              <p>
                {translate({
                  id: 'release.notice.failed',
                  message: 'The update did not load. Try again while online.',
                })}
              </p>
              <a href={RELEASE_URL}>
                {translate({ id: 'release.notice.release', message: 'Release page' })}
              </a>
              <a href={SUPPORT_URL}>
                {translate({ id: 'release.notice.support', message: 'Support issues' })}
              </a>
            </div>
          )}
        </section>
      )}
      {decision.kind === 'block' && (
        <div className={styles.backdrop}>
          <section
            className={styles.block}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="docs-update-title"
            aria-describedby="docs-update-reason"
          >
            <p className={styles.eyebrow}>
              {translate({ id: 'release.block.eyebrow', message: 'windowsweep docs' })}
            </p>
            <h1 id="docs-update-title">
              {translate({ id: 'release.block.title', message: 'Update required' })}
            </h1>
            <p>
              {translate(
                {
                  id: 'release.block.version',
                  message: 'Version {version} is required to continue.',
                },
                { version: decision.release.version }
              )}
            </p>
            <p id="docs-update-reason">{decision.release.reason}</p>
            <button
              ref={updateButton}
              className="button button--primary button--lg"
              type="button"
              onClick={() => void doUpdate()}
              disabled={working}
            >
              {working
                ? translate({ id: 'release.block.working', message: 'Updating…' })
                : translate({ id: 'release.block.update', message: 'Update' })}
            </button>
            {failed && (
              <div className={styles.failure} role="alert">
                <p>
                  {translate({
                    id: 'release.block.failed',
                    message: 'The update did not load. Try again while online.',
                  })}
                </p>
                <a href={RELEASE_URL}>
                  {translate({ id: 'release.block.release', message: 'Release page' })}
                </a>
                <a href={SUPPORT_URL}>
                  {translate({ id: 'release.block.support', message: 'Support issues' })}
                </a>
              </div>
            )}
          </section>
        </div>
      )}
    </>
  );
}
