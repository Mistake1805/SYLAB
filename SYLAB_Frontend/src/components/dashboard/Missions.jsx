import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Check, Gift } from 'lucide-react';
import { dailyMissions, weeklyMissions } from '../../data/mockData';
import { useInViewOnce } from '../../lib/useCountUp';
import ui from './dashboard.module.css';
import styles from './Missions.module.css';

const TABS = [
  { id: 'daily', label: 'Daily', data: dailyMissions },
  { id: 'weekly', label: 'Weekly', data: weeklyMissions },
];

// compact mode = a compact list of the first few daily missions (overview).
export default function Missions({ compact = false }) {
  const [tab, setTab] = useState('daily');
  const [ref, inView] = useInViewOnce();
  const list = compact ? dailyMissions.slice(0, 3) : TABS.find((t) => t.id === tab).data;

  return (
    <div className={ui.card} ref={ref}>
      <div className={ui.cardHead}>
        <div className={ui.cardTitle}>
          <span className={ui.cardIcon}><Target size={20} /></span>
          Missions
        </div>
        {!compact && (
          <div className={styles.tabs}>
            {TABS.map((t) => (
              <button
                key={t.id}
                className={`${styles.tab} ${tab === t.id ? styles.tabActive : ''}`}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}
        {compact && <span className={ui.muted}>Daily</span>}
      </div>

      <div className={styles.list}>
        <AnimatePresence mode="popLayout">
          {list.map((m, i) => {
            const pct = Math.min(1, m.done / m.target);
            const complete = m.done >= m.target;
            return (
              <motion.div
                key={m.id}
                className={`${styles.mission} ${complete ? styles.missionDone : ''}`}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
              >
                <div className={styles.missionHead}>
                  <span className={`${styles.check} ${complete ? styles.checkDone : ''}`}>
                    {complete ? <Check size={14} /> : null}
                  </span>
                  <span className={styles.missionTitle}>{m.title}</span>
                  <span className={`${ui.chip} ${ui.chipAccent}`}>
                    <Gift size={12} /> {m.xp} XP
                  </span>
                </div>
                <div className={styles.missionProgress}>
                  <div className={ui.bar}>
                    <motion.div
                      className={ui.barFill}
                      initial={{ scaleX: 0 }}
                      animate={inView ? { scaleX: pct } : {}}
                      transition={{ duration: 1, delay: 0.1 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                  <span className={ui.muted}>{m.done}/{m.target}</span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
