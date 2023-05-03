/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_ALLOW_CREDENTIALS: string;
	readonly VITE_CLIENT_ID: string;
	readonly VITE_CLIENT_SECRET: string;
	readonly VITE_VERCEL_SECRET: string;
	readonly VITE_MODE: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
