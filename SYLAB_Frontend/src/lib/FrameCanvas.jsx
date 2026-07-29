import { useEffect, useRef } from 'react';
import { frameUrls } from './frames';
import { FrameCache } from './FrameCache';
import styles from './FrameCanvas.module.css';

// =========================================================================
// FrameCanvas — the cinematic background engine.
//
// Responsibilities:
//   - Single fixed, full-viewport <canvas> behind the page (z-index: 0).
//   - High-DPI / Retina rendering, object-fit: cover scaling.
//   - Map whole-document scroll progress → frame index:
//         targetFrame = progress * (frameCount - 1)
//     Frame 1 at 0%, LAST frame only at 100% (absolute bottom).
//   - Damped interpolation (currentFrame -> targetFrame) so motion feels
//     premium and plays smoothly in BOTH scroll directions.
//   - Only redraw when the visible frame index actually changes → no flicker.
//
// `progressRef` is a ref to live scroll progress (see useScrollProgress) so we
// read every frame without forcing React re-renders.
//
// Optional `onLoadingChange(boolean)` lets a parent show a preloader until the
// first few frames are decoded.
// =========================================================================

export default function FrameCanvas({ progressRef, onLoadingChange }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });

    const cache = new FrameCache(frameUrls, { window: 12, evict: 24, concurrency: 8 });
    let lastDrawnIndex = -1;
    let rafId = 0;

    // currentFrame is a float eased toward targetFrame each tick. A higher
    // factor = snappier; lower = more cinematic/dreamy. 0.12 feels Apple-like.
    let currentFrame = 0;
    const DAMPING = 0.12;

    // --- Loading signal: ready when the first frame is decoded. ---
    let firstFrameReady = false;
    cache.onProgress = () => {
      if (!firstFrameReady && cache.get(0)) {
        firstFrameReady = true;
        onLoadingChange?.(false);
      }
    };

    // --- Sizing: support Retina/HiDPI and cover-fit. ---
    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2); // cap at 2x for memory
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      lastDrawnIndex = -1; // force a redraw with new scale
    }

    // Cover-fit: compute scale so the 4K image covers the viewport, centered.
    function drawCover(img) {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const iw = img.naturalWidth || img.width;
      const ih = img.naturalHeight || img.height;
      if (!iw || !ih) return;

      const scale = Math.max(vw / iw, vh / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      const dx = (vw - dw) / 2;
      const dy = (vh - dh) / 2;

      ctx.drawImage(img, dx, dy, dw, dh);
    }

    function drawFrame(index) {
      const img = cache.get(Math.round(index));
      if (img) {
        drawCover(img);
      } else {
        // Keep the last drawn frame visible (no flicker) and prime a load.
        cache.prime(index);
      }
    }

    // --- Main animation loop. ---
    function tick() {
      rafId = requestAnimationFrame(tick);

      const progress = progressRef.current ?? 0;
      const last = Math.max(0, cache.count - 1);
      const target = progress * last;

      // Framerate-independent damping.
      currentFrame += (target - currentFrame) * DAMPING;

      // Snap when very close to avoid endless micro-steps.
      if (Math.abs(target - currentFrame) < 0.01) currentFrame = target;

      const visibleIndex = Math.round(currentFrame);

      // Keep the sliding window centered on the current frame.
      cache.prime(currentFrame);

      // Only repaint when the visible frame changes → eliminates redundant
      // work and any flicker from redrawing identical content.
      if (visibleIndex !== lastDrawnIndex || lastDrawnIndex === -1) {
        lastDrawnIndex = visibleIndex;
        drawFrame(visibleIndex);
      }
    }

    // Kick everything off.
    resize();
    cache.prime(0);
    drawFrame(0);
    onLoadingChange?.(true);
    rafId = requestAnimationFrame(tick);

    // Debounced resize.
    let resizeTimer = 0;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 120);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
      cache.destroy();
    };
  }, [progressRef, onLoadingChange]);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
}
