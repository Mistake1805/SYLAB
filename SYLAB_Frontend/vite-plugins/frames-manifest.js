// Vite virtual module: auto-detects every image frame inside public/frames/,
// natural-sorts them, and exposes the sorted list of public URLs at runtime.
//
// Usage in app code:
//   import frameUrls from 'virtual:frames';
//
// Nothing about the frames is hardcoded: filenames, naming convention, and the
// total frame count are all discovered here. Renaming/adding/removing frames in
// public/frames/ is picked up automatically (the dev server reloads on change).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const VIRTUAL_ID = 'virtual:frames';
const RESOLVED_ID = '\0virtual:frames';

const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif']);

// Detect the integer token inside a filename so we can sort numerically.
// Handles conventions like: frame-001.jpg, image_10.png, ezgif-frame-002.jpg,
// 0001.webp, etc. Falls back to 0 when no number is found.
function extractIndex(name) {
  const match = name.match(/(\d+)(?=\D*$)/);
  return match ? parseInt(match[1], 10) : 0;
}

// Natural sort: primarily by the trailing integer (so 002 < 010), secondarily
// by the full filename as a tiebreaker for mixed conventions.
function naturalCompare(a, b) {
  const ia = extractIndex(a);
  const ib = extractIndex(b);
  if (ia !== ib) return ia - ib;
  return a.localeCompare(b);
}

export default function framesManifestPlugin() {
  let rootDir = process.cwd();

  return {
    name: 'sylab-frames-manifest',
    enforce: 'pre',
    configResolved(config) {
      rootDir = config.root || process.cwd();
    },
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID;
      return null;
    },
    load(id) {
      if (id !== RESOLVED_ID) return null;

      const publicFramesDir = path.join(rootDir, 'public', 'frames');
      let files = [];
      try {
        files = fs
          .readdirSync(publicFramesDir)
          .filter((f) => IMAGE_EXT.has(path.extname(f).toLowerCase()));
      } catch {
        // Directory missing — expose an empty list so the app can degrade
        // gracefully (e.g. show a solid backdrop) instead of crashing.
        files = [];
      }

      files.sort(naturalCompare);

      const urls = files.map((f) => `/frames/${f}`);
      const count = urls.length;

      return {
        code: [
          `export const frameUrls = ${JSON.stringify(urls)};`,
          `export const frameCount = ${count};`,
          `export default frameUrls;`,
        ].join('\n'),
        map: null,
      };
    },
  };
}
