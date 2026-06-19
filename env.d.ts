/// <reference types="vite/client" />
/// <reference types="vite/types/importMeta.d.ts" />
interface ImportMeta {
  readonly env: Record<string, string>;
}

declare module 'swiper/css';
declare module 'swiper/css/free-mode';
declare module 'swiper/css/navigation';
declare module 'swiper/css/thumbs';
