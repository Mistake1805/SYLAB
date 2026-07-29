import Section from '../Section';
import styles from './sections.module.css';

// Section 7 — Community. A warmer, social close before the final CTA.
export default function CommunitySection() {
  return (
    <Section align="center">
      <span className={styles.eyebrow}>Community</span>
      <h2 className={styles.heading}>You don&apos;t climb alone.</h2>
      <div className={styles.glassPanel}>
        <p className={styles.body}>
          Compare with friends, chase the global leaderboard, and share every win.
          A community built around growth — where every solve counts and every
          streak inspires someone else to start.
        </p>
      </div>
    </Section>
  );
}
