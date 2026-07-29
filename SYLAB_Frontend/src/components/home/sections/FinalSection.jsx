import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Section from '../Section';
import GlassButton from '../../common/GlassButton';
import styles from './sections.module.css';

// Section 8 — Final. The last frame is reached only here (100% scroll).
// "Enter SYLAB" CTA routes to the Dashboard.
export default function FinalSection() {
  const navigate = useNavigate();

  return (
    <Section align="center" minHeight="100vh">
      <motion.div
        className={styles.finalStack}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className={styles.eyebrow}>The Beginning</span>
        <h2 className={styles.finalHeading}>Enter SYLAB.</h2>
        <p className={styles.lede}>Your gamified coding journey starts now.</p>
        <motion.div
          className={styles.finalCta}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.6 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <GlassButton variant="pulse" size="lg" onClick={() => navigate('/dashboard')}>
            Enter SYLAB
          </GlassButton>
        </motion.div>
      </motion.div>
    </Section>
  );
}
