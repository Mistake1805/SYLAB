import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { currentUser } from '../../data/mockData';
import { useInViewOnce, useCountUp } from '../../lib/useCountUp';
import ui from './dashboard.module.css';
import styles from './Streak.module.css';

// Streak — current/best streak, animated flame, count-up, next milestone.
export default function Streak({ compact = false }) {
  const [ref, inView] = useInViewOnce();
  const current = useCountUp(currentUser.streak.current, inView, { duration: 1400 });
  const best = useCountUp(currentUser.streak.best, inView, { duration: 1600 });
  const toMilestone = currentUser.streak.nextMilestone - currentUser.streak.current;

  return (
    <div className={ui.card} ref={ref}>
      <div className={ui.cardHead}>
        <div className={ui.cardTitle}>
          <span className={ui.cardIcon}><Flame size={20} /></span>
          Streak
        </div>
        <span className={`${ui.chip} ${ui.chipWarn}`}>🔥 On fire</span>
      </div>

      <div className={styles.row}>
        <div className={styles.flameWrap}>
          <motion.div
            className={styles.flame}
            animate={{ scale: [1, 1.08, 0.97, 1.05, 1], rotate: [-1, 1, -1, 2, -1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Flame size={56} strokeWidth={1.6} />
          </motion.div>
          <motion.div
            className={styles.bigNumber}
            key={current}
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 1 }}
          >
            {current}
          </motion.div>
          <span className={styles.daysLabel}>day streak</span>
        </div>

        {!compact && (
          <div className={styles.statsCol}>
            <div className={styles.miniStat}>
              <span className={styles.miniLabel}>Current</span>
              <span className={styles.miniValue}>{current}</span>
            </div>
            <div className={styles.miniStat}>
              <span className={styles.miniLabel}>Best</span>
              <span className={styles.miniValue}>{best}</span>
            </div>
            <div className={styles.miniStat}>
              <span className={styles.miniLabel}>Next milestone</span>
              <span className={styles.miniValue}>{currentUser.streak.nextMilestone}</span>
            </div>
          </div>
        )}
      </div>

      <div className={styles.milestoneBar}>
        <div className={ui.bar}>
          <motion.div
            className={ui.barFill}
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: currentUser.streak.current / currentUser.streak.nextMilestone } : {}}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
        <span className={ui.muted}>{toMilestone} days to {currentUser.streak.nextMilestone}-day milestone</span>
      </div>
    </div>
  );
}
