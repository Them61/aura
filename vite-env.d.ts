/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string
  readonly VITE_STRIPE_API_ENDPOINT: string
  readonly VITE_DEV_SERVER_URL: string
  readonly GEMINI_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface Window {
  gtag?: (
    command: 'event',
    action: string,
    params?: Record<string, unknown>
  ) => void;
}