// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  preview: {
    host: '0.0.0.0', // ensure it's externally accessible
    port: 4173,       // optional: default preview port
    allowedHosts: ['botanicartdeploy.onrender.com']
  }
});
