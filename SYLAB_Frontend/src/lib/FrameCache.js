// =========================================================================
// FrameCache — sliding-window image cache for the cinematic frame sequence.
//
// 300 frames at 4K (~135KB each on disk) total ~40MB; decoding them all at once
// would blow past memory budgets. Instead we keep a small window around the
// current frame:
//   - keep   [current - W, current + W] decoded & resident
//   - evict  outside [current - 2W, current + 2W]  (release memory)
//   - cap concurrent decodes via inflight Map (fixes the documented Set bug)
//
// Exposed as a plain class (no React) so it is easy to test and reason about.
// =========================================================================

const DEFAULT_WINDOW = 12;     // W — preload ±W around current frame
const DEFAULT_EVICT = 24;      // 2W — evict outside ±2W
const DEFAULT_CONCURRENCY = 8; // simultaneous Image decodes

export class FrameCache {
  /**
   * @param {string[]} urls     Sorted frame URLs.
   * @param {object}   [opts]
   * @param {number}   [opts.window]       Half-window to preload (default 12).
   * @param {number}   [opts.evict]        Half-window to evict beyond (default 24).
   * @param {number}   [opts.concurrency]  Max concurrent decodes (default 8).
   */
  constructor(urls, opts = {}) {
    this.urls = urls || [];
    this.count = this.urls.length;

    this.window = opts.window ?? DEFAULT_WINDOW;
    this.evict = opts.evict ?? DEFAULT_EVICT;
    this.concurrency = opts.concurrency ?? DEFAULT_CONCURRENCY;

    /** @type {Map<number, HTMLImageElement>} */
    this.cache = new Map();
    /** @type {Map<number, Promise<HTMLImageElement>>} keyed by index (NOT a Set) */
    this.inflight = new Map();

    /** Number of fully decoded frames — useful for a loading indicator. */
    this.onProgress = null;
  }

  /**
   * Ensure the window around `index` is preloaded and evict far frames.
   * Call this every time the current frame changes.
   * @param {number} index  Current target frame index (will be clamped).
   */
  prime(index) {
    if (this.count === 0) return;
    const center = Math.max(0, Math.min(this.count - 1, Math.round(index)));
    const start = Math.max(0, center - this.window);
    const end = Math.min(this.count - 1, center + this.window);

    // Preload within the window, current frame first then nearest neighbors.
    const order = [center];
    for (let r = 1; r <= this.window; r++) {
      if (center - r >= start) order.push(center - r);
      if (center + r <= end) order.push(center + r);
    }
    for (const i of order) this._load(i);

    this._evict(center);
  }

  /**
   * Get a decoded frame if available, else null (caller may draw a fallback).
   * Calling get() also ensures the frame is requested.
   * @param {number} index
   * @returns {HTMLImageElement | null}
   */
  get(index) {
    if (index < 0 || index >= this.count) return null;
    const img = this.cache.get(index);
    if (img) return img;
    // Trigger lazy load so a one-off look-ahead still warms the cache.
    this._load(index);
    return null;
  }

  /**
   * Release every decoded image and cancel inflight promises.
   */
  destroy() {
    for (const img of this.cache.values()) {
      img.src = '';
    }
    this.cache.clear();
    this.inflight.clear();
  }

  // ---- internals ---------------------------------------------------------

  _load(index) {
    // Already decoded?
    if (this.cache.has(index)) return;
    // Already loading?
    if (this.inflight.has(index)) return;
    // Respect concurrency cap.
    if (this.inflight.size >= this.concurrency) return;

    const img = new Image();
    img.decoding = 'async';
    img.src = this.urls[index];

    const promise = new Promise((resolve, reject) => {
      img.onload = () => {
        this.cache.set(index, img);
        this.inflight.delete(index);
        this._notify();
        resolve(img);
      };
      img.onerror = () => {
        this.inflight.delete(index);
        // Leave a hole; the canvas will keep the last successful frame.
        reject(new Error(`Failed to load frame ${index}`));
      };
    });

    this.inflight.set(index, promise);

    // While under pressure, opportunistically load neighbors that the cap
    // blocked earlier once a slot frees up.
    promise.catch(() => {}).finally(() => this._drainQueue(index));
  }

  /**
   * When a load completes, try to service any blocked neighbors of `hint`.
   */
  _drainQueue(hint) {
    if (this.inflight.size >= this.concurrency) return;
    const center = Math.round(hint);
    for (let r = 1; r <= this.window; r++) {
      for (const i of [center + r, center - r]) {
        if (i < 0 || i >= this.count) continue;
        if (!this.cache.has(i) && !this.inflight.has(i)) {
          this._load(i);
          if (this.inflight.size >= this.concurrency) return;
        }
      }
    }
  }

  _evict(center) {
    const lo = center - this.evict;
    const hi = center + this.evict;
    for (const [i, img] of this.cache) {
      if (i < lo || i > hi) {
        img.src = '';
        this.cache.delete(i);
      }
    }
  }

  _notify() {
    if (typeof this.onProgress === 'function') {
      this.onProgress(this.cache.size, this.count);
    }
  }
}
