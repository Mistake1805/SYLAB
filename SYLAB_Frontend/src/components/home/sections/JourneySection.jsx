import Section from '../Section';
import styles from './sections.module.css';

// Section 3 — Coding Journey. Four-step rhythm: Learn, Build, Compete, Grow.
const STEPS = [
  { k: '01', t: 'Learn',   d: 'Master data structures, algorithms, and patterns with structured tracks.' },
  { k: '02', t: 'Build',   d: 'Turn concepts into instinct through thousands of curated problems.' },
  { k: '03', t: 'Compete', d: 'Test yourself in live contests against a global field.' },
  { k: '04', t: 'Grow',    d: 'Watch your rank, XP, and streaks climb as you level up.' },
];

export default function JourneySection() {
  return (
    <Section align="left">
      <span className={styles.eyebrow}>The Journey</span>
      <h2 className={styles.heading}>Four moves. One trajectory: up.</h2>
      <div className={styles.stepGrid}>
        {STEPS.map((s) => (
          <div key={s.k} className={styles.glassCard}>
            <span className={styles.stepKey}>{s.k}</span>
            <h3 className={styles.stepTitle}>{s.t}</h3>
            <p className={styles.stepBody}>{s.d}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
