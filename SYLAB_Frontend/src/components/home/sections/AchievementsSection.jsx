import { motion } from 'framer-motion';
import Section from '../Section';
import { useInViewOnce, useCountUp } from '../../../lib/useCountUp';
import styles from './sections.module.css';

// Section 5 — Achievements. Animated count-up stats for a premium reveal.
const STATS = [
  { value: 12000, suffix: '+', label: 'Problems' },
  { value: 50,    suffix: 'K', label: 'Active Coders' },
  { value: 8,     suffix: '',  label: 'Rank Tiers' },
  { value: 99.9,  suffix: '%', label: 'Uptime', decimals: 1 },
];

function StatItem({ value, suffix, label, decimals = 0 }) {
  const [ref, inView] = useInViewOnce({ threshold: 0.4 });
  const n = useCountUp(value, inView, { duration: 1400, decimals });
  return (
    <div className={styles.stat} ref={ref}>
      <motion.span
        className={styles.statValue}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6 }}
      >
        {n.toLocaleString()}{suffix}
      </motion.span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  );
}

export default function AchievementsSection() {
  return (
    <Section align="center">
      <span className={styles.eyebrow}>Achievements</span>
      <h2 className={styles.heading}>Numbers that compound.</h2>
      <div className={styles.statGrid}>
        {STATS.map((s) => (
          <StatItem key={s.label} {...s} />
        ))}
      </div>
    </Section>
  );
}
