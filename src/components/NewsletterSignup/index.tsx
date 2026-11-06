/**
 * The release-notes signup, the docs footer's top row (owner decision D90; web dummy amendment 35,
 * `docs-newsletter.html`). The same words, states and order as the website's changelog signup.
 *
 * States: idle → invalid (an address that is not complete, an empty one included: S6's words at the field,
 * role="alert", the field marked and focused, nothing sent) or pending (the button holds a spinner and cannot be
 * pressed twice; the field is read-only) → done ("Open the confirmation email ...", focus moved to it) or already
 * ("If this address is on the list ...", never a confirmation of membership) or failed (at the form,
 * role="alert", the address stays typed). Words: d91-strings S6 and S8, under double opt-in (dummy amendment 38).
 *
 * 🔴 It renders nothing until the build carries the list id and the subscribe-only key (`customFields`), and it
 * sends a Cloudflare Turnstile token when a site key is configured, as FilesHub asks of browser signups.
 */
import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { normalizeEmail, rememberSent, subscribe, wasSent } from '../../lib/newsletter';
import { turnstileToken } from './turnstile';
import styles from './styles.module.css';

/* emails-1.4.0.md, "Release newsletter signup — website and docs", with d91-strings S6 and S8 (approved). The
   docs site has no i18n catalogue, so its strings live here as the release gate's do. */
const T = {
  heading: 'Get release notes by email',
  body: 'One email when a windowsweep release is ready. It names what changed, where to get it and any limit that matters. No cleanup path, file name or machine name is collected for the list.',
  label: 'Email address',
  button: 'Get release emails',
  invalidEmail: 'Enter a complete email address, such as name@example.com.',
  done: 'Open the confirmation email in your inbox and confirm this address on the page it links to. Release emails start only after that, and you can leave the list from any of them.',
  already:
    'If this address is on the list, the next release email will arrive there. If it is not confirmed yet, open the confirmation email in your inbox.',
  failedLead: 'The signup was not confirmed. Try again or use the ',
  failedLink: 'site contact form',
  failedTail: '.',
} as const;
const CONTACT = 'https://windowsweep.aoneahsan.com/contact';
/* S6's shape, as the dummy checks it: something, one @, then a domain with a dot in it. */
const COMPLETE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type State = 'idle' | 'invalid' | 'pending' | 'done' | 'already' | 'failed';

function Check() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.icon}>
      <path
        d="M5 12.5l4.5 4.5L19 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function NewsletterSignup() {
  const { siteConfig } = useDocusaurusContext();
  const fields = siteConfig.customFields as {
    newsletterListId?: string;
    newsletterKey?: string;
    turnstileSiteKey?: string;
  };
  const id = useId();
  const [state, setState] = useState<State>('idle');
  const [address, setAddress] = useState('');
  const liveRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const captchaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state === 'done' || state === 'already') liveRef.current?.focus();
    if (state === 'invalid') inputRef.current?.focus();
  }, [state]);

  if (!fields.newsletterListId || !fields.newsletterKey) return null;
  const listId = fields.newsletterListId;
  const key = fields.newsletterKey;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === 'pending') return;
    const value = normalizeEmail(address);
    if (!COMPLETE.test(value)) {
      setState('invalid');
      return;
    }
    setState('pending');
    const token = fields.turnstileSiteKey
      ? await turnstileToken(fields.turnstileSiteKey, captchaRef.current)
      : null;
    if (fields.turnstileSiteKey && !token) {
      setState('failed');
      return;
    }
    const known = wasSent(value);
    const ok = await subscribe(listId, key, value, token);
    if (!ok) {
      setState('failed');
      return;
    }
    rememberSent(value);
    setState(known ? 'already' : 'done');
  }

  const answered = state === 'done' || state === 'already';
  return (
    <section
      className={styles.nl}
      aria-labelledby={`${id}-title`}
      aria-busy={state === 'pending'}
      data-state={state}
    >
      <div className={styles.copy}>
        <h2 id={`${id}-title`} className={`footer__title ${styles.title}`}>
          {T.heading}
        </h2>
        <p className={styles.body}>{T.body}</p>
      </div>
      <div className={styles.side}>
        {answered ? null : (
          <form className={styles.form} onSubmit={onSubmit} noValidate>
            <label className={styles.label} htmlFor={`${id}-email`}>
              {T.label}
            </label>
            <div className={styles.row}>
              <input
                id={`${id}-email`}
                className={styles.input}
                ref={inputRef}
                type="email"
                name="email"
                autoComplete="email"
                aria-invalid={state === 'invalid' ? true : undefined}
                aria-describedby={state === 'invalid' ? `${id}-email-error` : undefined}
                spellCheck={false}
                readOnly={state === 'pending'}
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  if (state === 'failed' || state === 'invalid') setState('idle');
                }}
              />
              <button
                type="submit"
                className={`button button--primary ${styles.button}`}
                disabled={state === 'pending'}
              >
                {state === 'pending' ? <span className={styles.spin} aria-hidden="true" /> : null}
                {T.button}
              </button>
            </div>
            {state === 'invalid' ? (
              <p id={`${id}-email-error`} className={styles.error} role="alert">
                <span>{T.invalidEmail}</span>
              </p>
            ) : null}
            {state === 'failed' ? (
              <p className={styles.error} role="alert">
                <span>
                  {T.failedLead}
                  <a href={CONTACT} target="_blank" rel="noopener noreferrer">
                    {T.failedLink}
                    <span className={styles.hidden}> (opens in a new tab)</span>
                  </a>
                  {T.failedTail}
                </span>
              </p>
            ) : null}
            <div ref={captchaRef} />
          </form>
        )}
        <div ref={liveRef} className={styles.live} role="status" tabIndex={-1}>
          {answered ? (
            <p className={styles.done}>
              <Check />
              <span>{state === 'already' ? T.already : T.done}</span>
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
