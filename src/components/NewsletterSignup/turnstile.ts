/**
 * One Cloudflare Turnstile token for the signup, when the build carries a site key.
 *
 * FilesHub's guide asks browser signups to send one with the origin-restricted key; FilesHub verifies it
 * server-side with the project's secret (vault service `turnstile`). The widget is rendered explicitly,
 * `interaction-only`, so a visitor sees nothing unless Cloudflare needs an answer. Cloudflare's script is loaded
 * only when the signup is used, never on every page.
 */

interface TurnstileApi {
  render: (el: HTMLElement, options: Record<string, unknown>) => string;
  execute: (widget: string) => void;
  reset: (widget: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
/** Give up on a challenge that never answers; the form then shows its failure line. */
const GIVE_UP_MS = 20_000;

let loading: Promise<TurnstileApi | null> | null = null;

function loadScript(): Promise<TurnstileApi | null> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  loading ??= new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = SCRIPT;
    script.async = true;
    script.onload = () => resolve(window.turnstile ?? null);
    script.onerror = () => {
      loading = null;
      resolve(null);
    };
    document.head.appendChild(script);
  });
  return loading;
}

/** A fresh token, or null when Cloudflare could not give one. */
export async function turnstileToken(
  siteKey: string,
  host: HTMLElement | null
): Promise<string | null> {
  if (!host) return null;
  const api = await loadScript();
  if (!api) return null;
  return new Promise((resolve) => {
    let widget = '';
    const finish = (token: string | null) => {
      window.clearTimeout(timer);
      if (widget) api.reset(widget);
      resolve(token);
    };
    const timer = window.setTimeout(() => finish(null), GIVE_UP_MS);
    host.replaceChildren();
    widget = api.render(host, {
      sitekey: siteKey,
      appearance: 'interaction-only',
      execution: 'execute',
      callback: (token: string) => finish(token),
      'error-callback': () => finish(null),
      'expired-callback': () => finish(null),
    });
    api.execute(widget);
  });
}
