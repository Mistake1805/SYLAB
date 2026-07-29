import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import framesManifest from './vite-plugins/frames-manifest.js';

// https://vite.dev/config/
export default defineConfig({
  plugins: [framesManifest(), react()],
});
