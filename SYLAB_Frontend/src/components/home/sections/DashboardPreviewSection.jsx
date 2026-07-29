import Section from '../Section';
import styles from './sections.module.css';

// Section 6 — Dashboard Preview. Teases the gamified hub waiting at the end.
export default function DashboardPreviewSection() {
  return (
    <Section align="center">
      <span className={styles.eyebrow}>The Hub</span>
      <h2 className={styles.heading}>Your command center awaits.</h2>
      <div className={`${styles.glassPanel} ${styles.previewPanel}`}>
        <div className={styles.previewMock}>
          <div className={styles.mockSidebar}>
            <span className={styles.mockDot} />
            <span className={styles.mockBar} />
            <span className={styles.mockBar} />
            <span className={styles.mockBar} />
          </div>
          <div className={styles.mockMain}>
            <div className={styles.mockCard} />
            <div className={styles.mockCard} />
            <div className={styles.mockCardWide} />
          </div>
        </div>
        <p className={styles.body}>
          Streaks, calendars, leaderboards, rankings, XP, boosters, and missions —
          all in one elegant, game-inspired interface.
        </p>
      </div>
    </Section>
  );
}
