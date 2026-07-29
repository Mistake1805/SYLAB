import { useEffect, useRef, useState } from 'react';

// =========================================================================
// useScrollProgress — reports whole-document scroll progress as 0..1.
//
// Sampling happens inside a single requestAnimationFrame loop (passive scroll
// + resize listeners) so it stays smooth and never thrashes layout. We also
// expose a ref (`progressRef`) for consumers that read every frame (like the
// canvas engine) without triggering React re-renders 60×/sec.
//
// scrollable = 0 at the very top, 1 at the absolute bottom of the document —
// which is exactly what maps the last frame to the end of the journey.
// =========================================================================

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);   // latest value, read by rAF consumers
  const rafRef = useRef(0);
  const dirtyRef = useRef(true);   // schedule a measurement when something changes

  useEffect(() => {
    const schedule = () => { dirtyRef.current = true; };

    const measure = () => {
      rafRef.current = 0;
      if (!dirtyRef.current) {
        rafRef.current = requestAnimationFrame(measure);
        return;
      }
      dirtyRef.current = false;

      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      // Guard against zero-height pages (e.g. during initial mount).
      const next = max > 0 ? doc.scrollTop / max : 0;
      const clamped = Math.max(0, Math.min(1, next));

      progressRef.current = clamped;
      setProgress((prev) => (Math.abs(prev - clamped) > 0.0005 ? clamped : prev));
      rafRef.current = requestAnimationFrame(measure);
    };

    // Measure once mounted and on every relevant input.
    schedule();
    rafRef.current = requestAnimationFrame(measure);

    const opts = { passive: true };
    window.addEventListener('scroll', schedule, opts);
    window.addEventListener('resize', schedule, opts);
    window.addEventListener('load', schedule);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('scroll', schedule, opts);
      window.removeEventListener('resize', schedule, opts);
      window.removeEventListener('load', schedule);
    };
  }, []);

  return { progress, progressRef };
}
