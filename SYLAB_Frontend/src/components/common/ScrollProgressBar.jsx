import styles from './ScrollProgressBar.module.css';

// Slim top progress bar showing journey progress 0→100%. Purely informational
// — the frame engine reads scroll directly; this is just a nice affordance.
export default function ScrollProgressBar({ progress }) {
  const pct = Math.round((progress || 0) * 100);
  return (
    <div className={styles.track} aria-hidden="true">
      <div className={styles.fill} style={{ transform: `scaleX(${progress || 0})` }} />
    </div>
  );
}
