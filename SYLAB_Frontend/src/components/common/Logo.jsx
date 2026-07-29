import styles from './Logo.module.css';

// SYLAB wordmark. Minimal geometric mark + tracked-out letters, in the spirit
// of Apple/Samsung launch pages. `variant` switches between mono (white) and
// pulse (coral→violet gradient) treatments.
export default function Logo({ variant = 'mono', size = 'md', className = '' }) {
  return (
    <span className={`${styles.logo} ${styles[size]} ${styles[variant]} ${className}`}>
      <span className={styles.mark} aria-hidden="true">
        <svg viewBox="0 0 32 32" width="100%" height="100%" fill="none">
          <path
            d="M6 25V7l10 9V7m4 18V7"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className={styles.word}>SYLAB</span>
    </span>
  );
}
