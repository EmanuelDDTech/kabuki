/// <reference types="vite/client" />
/// <reference types="vite/types/importMeta.d.ts" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // más variables de entorno...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module 'swiper/css';
declare module 'swiper/css/free-mode';
declare module 'swiper/css/navigation';
declare module 'swiper/css/thumbs';
