// import type { PlaywrightTestConfig } from '@playwright/test';

const config = {
	webServer: {
		command: 'set VITE_ALLOW_CREDENTIALS=true && npm run build && npm run preview',
		port: 4173
	},
	testDir: 'tests'
};

export default config;
