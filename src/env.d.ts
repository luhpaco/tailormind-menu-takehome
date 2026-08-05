/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_APPS_SCRIPT_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
