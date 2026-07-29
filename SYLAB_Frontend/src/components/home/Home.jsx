import { useCallback, useEffect, useState } from 'react';
import { useScrollProgress } from '../../lib/useScrollProgress';
import CinematicBackground from './CinematicBackground';
import ScrollProgressBar from '../common/ScrollProgressBar';
import IntroSection from './sections/IntroSection';
import AboutSection from './sections/AboutSection';
import JourneySection from './sections/JourneySection';
import FeaturesSection from './sections/FeaturesSection';
import AchievementsSection from './sections/AchievementsSection';
import DashboardPreviewSection from './sections/DashboardPreviewSection';
import CommunitySection from './sections/CommunitySection';
import FinalSection from './sections/FinalSection';
import styles from './Home.module.css';

// =========================================================================
// Home — the single cinematic scroll experience.
//
// The page is one tall, normal-flow document so the window itself scrolls and
// the fixed canvas maps frame-by-frame across the ENTIRE document height.
// 8 sections are stacked vertically; the frame engine runs in the background
// and the final frame appears ONLY at the absolute bottom (Section 8).
// =========================================================================

export default function Home() {
  const { progress, progressRef } = useScrollProgress();
  const [loading, setLoading] = useState(true);

  // Scroll the user back to top on mount so the journey always starts at
  // frame 1 (progress 0). Restores cleanly on browser back/forward too.
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  const handleLoadingChange = useCallback((isLoading) => setLoading(isLoading), []);

  return (
    <div className={styles.page}>
      <CinematicBackground
        progressRef={progressRef}
        onLoadingChange={handleLoadingChange}
      />

      <ScrollProgressBar progress={progress} />

      <main className={styles.main}>
        <IntroSection />
        <AboutSection />
        <JourneySection />
        <FeaturesSection />
        <AchievementsSection />
        <DashboardPreviewSection />
        <CommunitySection />
        <FinalSection />
      </main>

      {loading && (
        <div className={styles.loader} aria-live="polite">
          <div className={styles.loaderBar}>
            <div className={styles.loaderBarFill} />
          </div>
          <span className={styles.loaderText}>Preparing the experience…</span>
        </div>
      )}
    </div>
  );
}
