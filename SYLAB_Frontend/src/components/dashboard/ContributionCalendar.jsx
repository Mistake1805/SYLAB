import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays } from 'lucide-react';
import { contributionCalendar } from '../../data/mockData';
import { useInViewOnce } from '../../lib/useCountUp';
import ui from './dashboard.module.css';
import styles from './Calendar.module.css';

// Contribution Calendar — GitHub-style activity grid. ~52 weeks × 7 days.
// Each cell colored by activity count; hover shows a tooltip with the count.
const DAYS = 7;
const TOTAL = contributionCalendar.length;
const WEEKS = Math.ceil(TOTAL / DAYS);

function levelClass(count) {
  if (count === 0) return styles.l0;
  if (count <= 2) return styles.l1;
  if (count <= 4) return styles.l2;
  if (count <= 7) return styles.l3;
  return styles.l4;
}

export default function ContributionCalendar() {
  const [ref, inView] = useInViewOnce();
  const [hover, setHover] = useState(null); // { idx, x, y, count }

  // Build week columns.
  const weeks = useMemo(() => {
    const cols = [];
    for (let w = 0; w < WEEKS; w++) {
      const col = [];
      for (let d = 0; d < DAYS; d++) {
        const idx = w * DAYS + d;
        col.push({ idx, count: idx < TOTAL ? contributionCalendar[idx] : -1 });
      }
      cols.push(col);
    }
    return cols;
  }, []);

  const totalSolved = useMemo(
    () => contributionCalendar.reduce((a, b) => a + b, 0),
    [],
  );

  return (
    <div className={ui.card} ref={ref}>
      <div className={ui.cardHead}>
        <div className={ui.cardTitle}>
          <span className={ui.cardIcon}><CalendarDays size={20} /></span>
          Contribution Calendar
        </div>
        <span className={`${ui.chip} ${ui.chipSuccess}`}>{totalSolved} solves this year</span>
      </div>

      <div className={styles.scrollWrap}>
        <div className={styles.grid}>
          {weeks.map((col, w) => (
            <div key={w} className={styles.col}>
              {col.map(({ idx, count }) =>
                count >= 0 ? (
                  <motion.div
                    key={idx}
                    className={`${styles.cell} ${levelClass(count)}`}
                    initial={{ opacity: 0, scale: 0.4 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.2, delay: Math.min(idx * 0.0015, 0.5) }}
                    onMouseEnter={(e) =>
                      setHover({ idx, x: e.clientX, y: e.clientY, count })
                    }
                    onMouseLeave={() => setHover(null)}
                  />
                ) : (
                  <div key={idx} className={styles.cellEmpty} />
                ),
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.legend}>
        <span className={ui.muted}>Less</span>
        <span className={`${styles.cell} ${styles.l0} ${styles.lgCell}`} />
        <span className={`${styles.cell} ${styles.l1} ${styles.lgCell}`} />
        <span className={`${styles.cell} ${styles.l2} ${styles.lgCell}`} />
        <span className={`${styles.cell} ${styles.l3} ${styles.lgCell}`} />
        <span className={`${styles.cell} ${styles.l4} ${styles.lgCell}`} />
        <span className={ui.muted}>More</span>
      </div>

      {hover && (
        <div
          className={styles.tooltip}
          style={{ left: hover.x, top: hover.y }}
        >
          {hover.count > 0 ? `${hover.count} solves` : 'No activity'}
        </div>
      )}
    </div>
  );
}
