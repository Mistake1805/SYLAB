import { forwardRef } from 'react';
import FrameCanvas from '../../lib/FrameCanvas';
import styles from './CinematicBackground.module.css';

// =========================================================================
// CinematicBackground — hosts the fixed <canvas> frame engine plus a layered
// gradient scrim. The scrim guarantees text legibility over any frame content
// (the frame imagery is unknown) without dimming the animation too much.
//
// We forward a ref so Home can pass its scroll-progress ref down into the
// canvas engine. A subtle vignette + bottom fade frame the cinematic feel.
// =========================================================================

const CinematicBackground = forwardRef(function CinematicBackground(
  { progressRef, onLoadingChange },
  ref,
) {
  return (
    <div className={styles.wrapper} ref={ref}>
      <FrameCanvas progressRef={progressRef} onLoadingChange={onLoadingChange} />
      <div className={styles.scrim} aria-hidden="true" />
      <div className={styles.vignette} aria-hidden="true" />
    </div>
  );
});

export default CinematicBackground;
