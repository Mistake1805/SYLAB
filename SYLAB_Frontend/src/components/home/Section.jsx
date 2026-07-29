import { motion } from 'framer-motion';
import styles from './Section.module.css';

// =========================================================================
// Section — a full-height cinematic section. Provides:
//   - consistent min-height & vertical centering
//   - a Framer Motion whileInView fade + slide-up for the content
//   - optional parallax via useScroll/useTransform is handled per-section
// `tone` switches text alignment helper. `index` lets parents stagger.
// =========================================================================

export default function Section({
  children,
  className = '',
  align = 'left',
  minHeight = '100vh',
  id,
}) {
  return (
    <section
      id={id}
      className={`${styles.section} ${styles[align]} ${className}`}
      style={{ minHeight }}
    >
      <motion.div
        className={styles.inner}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.35 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </section>
  );
}
