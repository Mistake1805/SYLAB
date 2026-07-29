import Section from '../Section';
import styles from './sections.module.css';

// Section 4 — Features. Showcase of the gamified systems.
const FEATURES = [
  { t: 'Streaks',       d: 'Build unbreakable consistency with flame-fueled streaks.' },
  { t: 'XP & Levels',   d: 'Every solve rewards XP. Climb levels like an RPG.' },
  { t: 'Rankings',      d: 'Bronze to Legend — eight tiers of prestige.' },
  { t: 'Leaderboards',  d: 'Global, weekly, and friends. See where you stand.' },
  { t: 'Boosters',      d: 'Stack multipliers and accelerate your progress.' },
  { t: 'Missions',      d: 'Daily and weekly goals keep the momentum alive.' },
];

export default function FeaturesSection() {
  return (
    <Section align="center">
      <span className={styles.eyebrow}>Features</span>
      <h2 className={styles.heading}>Built to keep you addicted to progress.</h2>
      <div className={styles.featureGrid}>
        {FEATURES.map((f) => (
          <div key={f.t} className={styles.glassCard}>
            <h3 className={styles.featureTitle}>{f.t}</h3>
            <p className={styles.stepBody}>{f.d}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
