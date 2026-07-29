import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import Logo from '../common/Logo';
import GlassButton from '../common/GlassButton';
import styles from './Login.module.css';

// Minimal Apple-style login gate.
// Full-screen dark, centered logo, single premium Continue button, smooth
// fade-in. Clicking Continue establishes a session and routes to /home.
export default function Login() {
  const navigate = useNavigate();
  const { enter } = useAuth();

  const handleContinue = () => {
    enter();
    navigate('/home');
  };

  return (
    <motion.main
      className={styles.screen}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={styles.ambient} aria-hidden="true" />

      <motion.div
        className={styles.content}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <Logo variant="pulse" size="xl" />
        </motion.div>

        <motion.p
          className={styles.tagline}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.6 }}
        >
          Gamify your coding journey.
        </motion.p>

        <motion.div
          className={styles.cta}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          <GlassButton variant="pulse" size="lg" onClick={handleContinue}>
            Continue
          </GlassButton>
        </motion.div>
      </motion.div>
    </motion.main>
  );
}
