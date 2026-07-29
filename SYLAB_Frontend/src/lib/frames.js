// Consumes the virtual module produced by vite-plugins/frames-manifest.js.
// This is the single source of truth for the frame sequence: nothing here is
// hardcoded — filenames, naming convention, and total count are all discovered
// at build time from public/frames/.
//
// frameUrls is a natural-sorted array of public URLs, e.g.
//   ['/frames/ezgif-frame-001.jpg', ..., '/frames/ezgif-frame-300.jpg']
//
// Gracefully degrades to an empty list if the directory is missing.

export { frameUrls, frameCount } from 'virtual:frames';
