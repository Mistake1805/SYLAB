import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Section from '../Section';
import Logo from '../../common/Logo';
import styles from './sections.module.css';

// Section 1 — Introduction. Big statement + SYLAB wordmark. Parallax fade-out
// as the user begins to scroll, handing the stage to the frame animation.
export default function IntroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -80]);

  return (
    <div ref={ref} className={styles.sectionHost}>
      <Section align="center" minHeight="100vh">
        <motion.div style={{ opacity, y }} className={styles.stack}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <Logo variant="mono" size="xl" />
          </motion.div>

          <motion.h1
            className={styles.display}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            Welcome to the future
            <br />
            of coding.
          </motion.h1>

          <motion.p
            className={styles.lede}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.9 }}
          >
            Scroll to begin the journey.
          </motion.p>

          <motion.div
            className={styles.scrollHint}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.4 }}
          >
            <span />
          </motion.div>
        </motion.div>
      </Section>
    </div>
  );
}
