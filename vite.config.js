// ==========================================
// VITE CONFIGURATION
// FIXED: Local Dev + WebSocket HMR
// ==========================================

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // ✅ LOCAL DEV ke liye root path
  base: '/',

  plugins: [react()],

  server: {
    port: 5173,
    host: true,
    strictPort: false,

    // ==========================================
    // FIX: HMR (Hot Module Replacement)
    // ==========================================
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5173,
      path: '/',
    },

    // ==========================================
    // FIX: WebSocket config
    // ==========================================
    ws: {
      protocol: 'ws',
      host: 'localhost',
      port: 5173,
      path: '/',
    },
  },

  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',

    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
});