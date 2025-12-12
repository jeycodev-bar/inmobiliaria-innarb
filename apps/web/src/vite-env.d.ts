/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_FORMSPREE_ID: string;
    // aquí puedes añadir más variables de entorno si las tuvieras
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}