import { motion } from 'framer-motion';
import { Zap, Sunrise, Trophy, Flame, Rocket } from 'lucide-react';
import { boosters } from '../../data/mockData';
import { useInViewOnce } from '../../lib/useCountUp';
import ui from './dashboard.module.css';
import styles from './Boosters.module.css';

// Map the icon string in mock data → actual lucide component.
const ICONS = { Zap, Sunrise, Trophy, Flame, Rocket };

export default function Boosters() {
  const [ref, inView] = useInViewOnce();
  const active = boosters.filter((b) => b.active);
  const inactive = boosters.filter((b) => !b.active);

  return (
    <div className={ui.card} ref={ref}>
      <div className={ui.cardHead}>
        <div className={ui.cardTitle}>
          <span className={ui.cardIcon}><Rocket size={20} /></span>
          Boosters
        </div>
        <span className={`${ui.chip} ${ui.chipSuccess}`}>{active.length} active</span>
      </div>

      {active.length > 0 && (
        <>
          <div className={styles.sectionLabel}>Active</div>
          <div className={styles.grid}>
            {active.map((b, i) => {
              const Icon = ICONS[b.icon] || Zap;
              return (
                <motion.div
                  key={b.id}
                  className={`${styles.booster} ${styles.boosterActive}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                >
                  <div className={styles.boosterHead}>
                    <span className={styles.boosterIcon}><Icon size={20} /></span>
                    <span className={`${ui.chip} ${ui.chipSuccess}`}>{b.remaining} left</span>
                  </div>
                  <div className={styles.boosterName}>{b.name}</div>
                  <div className={styles.boosterDesc}>{b.description}</div>
                  <div className={styles.timerBar}>
                    <motion.div
                      className={styles.timerFill}
                      initial={{ scaleX: 0 }}
                      animate={inView ? { scaleX: 0.5 } : {}}
                      transition={{ duration: 1, delay: 0.2 }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </>
      )}

      <div className={styles.sectionLabel} style={{ marginTop: 'var(--space-6)' }}>Available</div>
      <div className={styles.grid}>
        {inactive.map((b, i) => {
          const Icon = ICONS[b.icon] || Zap;
          return (
            <motion.div
              key={b.id}
              className={`${styles.booster} ${styles.boosterLocked}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <div className={styles.boosterHead}>
                <span className={styles.boosterIcon}><Icon size={20} /></span>
                <span className={ui.chip}>{b.duration}</span>
              </div>
              <div className={styles.boosterName}>{b.name}</div>
              <div className={styles.boosterDesc}>{b.description}</div>
              <button className={styles.activateBtn}>Activate</button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
