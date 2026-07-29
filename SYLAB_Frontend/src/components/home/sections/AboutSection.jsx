import Section from '../Section';
import styles from './sections.module.css';

// Section 2 — About SYLAB. Glass panel introducing the platform.
export default function AboutSection() {
  return (
    <Section align="left">
      <span className={styles.eyebrow}>About</span>
      <h2 className={styles.heading}>
        A platform that turns <span className={styles.accentText}>practice</span> into progress.
      </h2>
      <div className={styles.glassPanel}>
        <p className={styles.body}>
          SYLAB is a premium, gamified coding platform. Every problem you solve,
          every streak you keep, and every contest you enter compounds into
          measurable growth — wrapped in an experience that feels less like a
          dashboard and more like a game.
        </p>
      </div>
    </Section>
  );
}
