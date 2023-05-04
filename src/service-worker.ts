/// <reference lib="webworker" />
import { build, files, version } from '$service-worker';
import { addFilesToCache, deleteOldCaches, fetchWithCacheOnError } from './lib/service-worker';

declare const self: ServiceWorkerGlobalScope;

const cacheId = `cache-${version}`;

const appFiles = ['/birthdays'];
const assets = [...build, ...files, ...appFiles];

self.addEventListener('install', (event: any) => {
	event.waitUntil(addFilesToCache(cacheId, assets));
});

self.addEventListener('activate', (event: any) => {
	event.waitUntil(deleteOldCaches(cacheId));
	event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event: any) => {
	if (
		event.request.method !== 'GET' ||
		!event.request.url.startsWith('http') ||
		event.request.url.startsWith('chrome-extension') ||
		event.request.url.includes('extension')
	) {
		return;
	}

	event.respondWith(fetchWithCacheOnError(cacheId, event.request));
});
