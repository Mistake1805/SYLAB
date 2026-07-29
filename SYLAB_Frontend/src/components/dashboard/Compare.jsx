import { motion } from 'framer-motion';
import { GitCompareArrows } from 'lucide-react';
import { comparePeers } from '../../data/mockData';
import { useInViewOnce } from '../../lib/useCountUp';
import ui from './dashboard.module.css';
import styles from './Compare.module.css';

const METRICS = [
  { key: 'xp',     label: 'XP',     format: (v) => v.toLocaleString() },
  { key: 'solved', label: 'Solved', format: (v) => v.toLocaleString() },
  { key: 'streak', label: 'Streak', format: (v) => `${v}d` },
  { key: 'rank',   label: 'Rank',   format: (v) => (v === 0 ? '—' : `#${v}`) },
];

export default function Compare() {
  const [ref, inView] = useInViewOnce();

  // Max per metric drives bar widths.
  const max = METRICS.reduce((acc, m) => {
    // For rank, lower is better; invert by using reciprocal-ish normalization
    // handled in render. For others, take the max value.
    if (m.key === 'rank') return acc;
    acc[m.key] = Math.max(...comparePeers.map((p) => p[m.key]));
    return acc;
  }, {});

  const peers = comparePeers;

  return (
    <div className={ui.card} ref={ref}>
      <div className={ui.cardHead}>
        <div className={ui.cardTitle}>
          <span className={ui.cardIcon}><GitCompareArrows size={20} /></span>
          Compare
        </div>
        <span className={ui.muted}>vs friends &amp; global average</span>
      </div>

      <div className={styles.grid}>
        {METRICS.map((metric) => (
          <div key={metric.key} className={styles.metricBlock}>
            <div className={styles.metricLabel}>{metric.label}</div>
            <div className={styles.bars}>
              {peers.map((p, i) => {
                const val = p[metric.key];
                let pct;
                if (metric.key === 'rank') {
                  // lower rank number = better; map 1..400 → 100%..10%
                  pct = val === 0 ? 0.12 : Math.max(0.1, 1 - Math.min(val, 400) / 440);
                } else {
                  pct = max[metric.key] ? val / max[metric.key] : 0;
                }
                return (
                  <div key={p.handle} className={styles.peerRow}>
                    <span className={`${styles.peerName} ${p.you ? styles.peerYou : ''} ${p.avg ? styles.peerAvg : ''}`}>
                      {p.name}
                    </span>
                    <div className={styles.peerBarTrack}>
                      <motion.div
                        className={`${styles.peerBar} ${p.you ? styles.peerBarYou : ''}`}
                        initial={{ scaleX: 0 }}
                        animate={inView ? { scaleX: Math.max(0.04, pct) } : {}}
                        transition={{ duration: 1, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </div>
                    <span className={styles.peerVal}>{metric.format(val)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
