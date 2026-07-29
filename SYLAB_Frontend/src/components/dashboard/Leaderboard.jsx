import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Crown } from 'lucide-react';
import { leaderboard, tiers } from '../../data/mockData';
import { useInViewOnce } from '../../lib/useCountUp';
import ui from './dashboard.module.css';
import styles from './Leaderboard.module.css';

const TABS = [
  { id: 'global', label: 'Global' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'friends', label: 'Friends' },
];

const tierColor = (name) => tiers.find((t) => t.name === name)?.color || 'var(--text)';

export default function Leaderboard() {
  const [tab, setTab] = useState('global');
  const [ref, inView] = useInViewOnce();
  const rows = leaderboard[tab];

  // Podium = top 3 of the active tab.
  const podium = rows.slice(0, 3);

  return (
    <div className={ui.card} ref={ref}>
      <div className={ui.cardHead}>
        <div className={ui.cardTitle}>
          <span className={ui.cardIcon}><Trophy size={20} /></span>
          Leaderboard
        </div>
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
      </div>

      {/* Podium */}
      <div className={styles.podium}>
        {[1, 0, 2].map((slot) => {
          const p = podium[slot];
          if (!p) return <div key={slot} className={styles.podiumSlot} />;
          const place = slot + 1;
          return (
            <motion.div
              key={p.handle}
              className={`${styles.podiumSlot} ${styles[`place${place}`]}`}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: place * 0.08 }}
            >
              <div className={styles.podiumAvatar} style={{ color: tierColor(p.tier) }}>
                {place === 1 ? <Crown size={22} /> : p.name.charAt(0)}
              </div>
              <div className={styles.podiumName}>{p.name}</div>
              <div className={styles.podiumRank}>#{p.rank}</div>
              <div className={styles.podiumBar} style={{ '--h': `${place === 1 ? 100 : place === 2 ? 74 : 52}%` }} />
            </motion.div>
          );
        })}
      </div>

      {/* Rest of the list */}
      <div className={styles.list}>
        <AnimatePresence mode="popLayout">
          {rows.slice(3).map((r, i) => (
            <motion.div
              key={`${tab}-${r.handle}`}
              className={styles.row}
              layout
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.35, delay: i * 0.04 }}
            >
              <span className={styles.rowRank}>#{r.rank}</span>
              <span className={styles.rowAvatar} style={{ color: tierColor(r.tier) }}>{r.name.charAt(0)}</span>
              <div className={styles.rowInfo}>
                <span className={styles.rowName}>{r.name}</span>
                <span className={styles.rowTier} style={{ color: tierColor(r.tier) }}>{r.tier}</span>
              </div>
              <div className={styles.rowStat}>
                <span className={styles.rowStatValue}>{r.xp.toLocaleString()}</span>
                <span className={ui.muted}>XP</span>
              </div>
              <div className={styles.rowStat}>
                <span className={styles.rowStatValue}>{r.solved.toLocaleString()}</span>
                <span className={ui.muted}>solved</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
