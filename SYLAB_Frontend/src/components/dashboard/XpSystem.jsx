import { motion } from 'framer-motion';
import { Zap, Star } from 'lucide-react';
import { currentUser } from '../../data/mockData';
import { useInViewOnce, useCountUp } from '../../lib/useCountUp';
import ui from './dashboard.module.css';
import styles from './XpSystem.module.css';

// XP System — level + XP progression bar with count-up. `compact` renders a
// slim header widget (used in the top bar and overview grid).
export default function XpSystem({ compact = false }) {
  const [ref, inView] = useInViewOnce();
  const xp = useCountUp(currentUser.xp, inView || compact, { duration: 1500 });
  const pct = currentUser.xp / currentUser.xpToNext;

  if (compact) {
    return (
      <div className={styles.compact} ref={ref}>
        <div className={styles.compactHead}>
          <span className={`${ui.chip} ${ui.chipPrimary}`}><Star size={12} /> Level {currentUser.level}</span>
          <span className={ui.muted}>{xp.toLocaleString()} XP</span>
        </div>
        <div className={ui.bar}>
          <motion.div
            className={ui.barFill}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: pct }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={ui.card} ref={ref}>
      <div className={ui.cardHead}>
        <div className={ui.cardTitle}>
          <span className={`${ui.cardIcon} ${ui.cardIconAlt}`}><Zap size={20} /></span>
          Experience
        </div>
        <span className={`${ui.chip} ${ui.chipAccent}`}>Level {currentUser.level}</span>
      </div>

      <div className={styles.xpRow}>
        <div>
          <div className={styles.xpValue}>{xp.toLocaleString()}</div>
          <div className={ui.muted}>of {currentUser.xpToNext.toLocaleString()} XP to Level {currentUser.level + 1}</div>
        </div>
        <div className={styles.levelBadge}>{currentUser.level}</div>
      </div>

      <div className={ui.bar} style={{ marginTop: 'var(--space-5)', height: 12 }}>
        <motion.div
          className={ui.barFill}
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: pct } : {}}
          transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <div className={styles.barFoot}>
        <span className={ui.muted}>{Math.round(pct * 100)}% complete</span>
        <span className={ui.muted}>{(currentUser.xpToNext - currentUser.xp).toLocaleString()} XP to go</span>
      </div>
    </div>
  );
}
