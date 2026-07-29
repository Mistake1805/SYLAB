import { useEffect, useRef, useState } from 'react';

// =========================================================================
// useInViewOnce — returns [ref, inView]. Fires once when the element enters
// the viewport, then stops observing. Used to trigger fade-ins & count-ups.
// =========================================================================

export function useInViewOnce({ threshold = 0.25, rootMargin = '0px 0px -10% 0px' } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold, rootMargin },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [inView, threshold, rootMargin]);

  return [ref, inView];
}

// =========================================================================
// useCountUp — animates a number from 0 to `end` once `active` becomes true.
// Uses requestAnimationFrame with an ease-out curve for a premium feel.
// =========================================================================

export function useCountUp(end, active, { duration = 1200, decimals = 0 } = {}) {
  const [value, setValue] = useState(0);
  const rafRef = useRef(0);

  useEffect(() => {
    if (!active) return;
    let start = 0;
    const from = 0;
    const animate = (ts) => {
      if (!start) start = ts;
      const elapsed = ts - start;
      const t = Math.min(1, elapsed / duration);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(from + (end - from) * eased);
      if (t < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [end, active, duration]);

  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}
