import { motion } from 'framer-motion';
import { Medal, Lock } from 'lucide-react';
import { currentUser, tiers } from '../../data/mockData';
import { useInViewOnce } from '../../lib/useCountUp';
import ui from './dashboard.module.css';
import styles from './RankingSystem.module.css';

// Ranking System — tier ladder Bronze→Legend, current tier highlighted with
// progress to the next, locked/unlocked animation states.
export default function RankingSystem({ compact = false }) {
  const [ref, inView] = useInViewOnce();
  const currentIdx = currentUser.tierIndex;
  const ladder = compact ? tiers.slice(Math.max(0, currentIdx - 1), currentIdx + 2) : tiers;

  return (
    <div className={ui.card} ref={ref}>
      <div className={ui.cardHead}>
        <div className={ui.cardTitle}>
          <span className={ui.cardIcon}><Medal size={20} /></span>
          Ranking
        </div>
        <span className={ui.chip} style={{ color: tiers[currentIdx].color, background: 'rgba(255,255,255,0.06)' }}>
          {currentUser.tier} · #{currentUser.rank}
        </span>
      </div>

      {!compact && (
        <div className={styles.progressBlock}>
          <div className={ui.bar} style={{ height: 10 }}>
            <motion.div
              className={ui.barFill}
              style={{ background: `linear-gradient(90deg, ${tiers[currentIdx].color}, ${tiers[Math.min(currentIdx + 1, tiers.length - 1)].color})` }}
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 0.55 } : {}}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
          <span className={ui.muted}>55% to {tiers[currentIdx + 1]?.name || 'max'} tier</span>
        </div>
      )}

      <div className={styles.ladder}>
        {ladder.map((tier, i) => {
          const realIdx = compact ? Math.max(0, currentIdx - 1) + i : i;
          const unlocked = realIdx <= currentIdx;
          const isCurrent = realIdx === currentIdx;
          return (
            <motion.div
              key={tier.name}
              className={`${styles.tier} ${isCurrent ? styles.tierCurrent : ''} ${!unlocked ? styles.tierLocked : ''}`}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.06, duration: 0.5 }}
            >
              <div className={styles.tierBadge} style={{ color: unlocked ? tier.color : 'var(--text-dim)', borderColor: isCurrent ? tier.color : 'transparent' }}>
                {unlocked ? <Medal size={22} /> : <Lock size={16} />}
              </div>
              <span className={styles.tierName} style={{ color: unlocked ? 'var(--text)' : 'var(--text-muted)' }}>
                {tier.name}
              </span>
              {isCurrent && <span className={styles.youBadge}>You</span>}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
