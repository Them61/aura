import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          '/api': {
            target: 'http://localhost:3001',
            changeOrigin: true,
            secure: false,
          },
        },
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.VITE_STRIPE_PUBLISHABLE_KEY': JSON.stringify(env.VITE_STRIPE_PUBLISHABLE_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        minify: 'terser',
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
          },
          output: {
            comments: false,
          },
        },
        rollupOptions: {
          output: {
            manualChunks: {
              'vendor-core': ['react', 'react-dom'],
              'vendor-routing': ['react-router-dom'],
              'vendor-stripe': ['@stripe/stripe-js', 'stripe'],
              'vendor-supabase': ['@supabase/supabase-js'],
              'vendor-icons': ['lucide-react'],
            },
          },
        },
        chunkSizeWarningLimit: 1000,
        reportCompressedSize: false,
      }
    };
});
