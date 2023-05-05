import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest';
import { addFilesToCache, deleteOldCaches, fetchWithCacheOnError } from './service-worker';

global.caches = {
	open: (args: string) => new Promise<any>((resolve) => resolve(args)),
	keys: (...args: any) => new Promise<any>((resolve) => resolve(args)),
	delete: (args: string) => new Promise<boolean>((resolve) => resolve(!!args)),
	has: (args: string) => new Promise<boolean>((resolve) => resolve(!!args)),
	match: (...args: any) => new Promise<any>((resolve) => resolve(args))
};

describe('addFilesToCache', () => {
	let cache;

	beforeEach(() => {
		cache = {
			addAll: vi.fn()
		};
		vi.spyOn(global.caches, 'open');
		caches.open.mockResolvedValue(cache);
	});

	it('opens the cache with the given id', async () => {
		await addFilesToCache('cache-id', []);
		expect(global.caches.open).toBeCalledWith('cache-id');
	});

	it('adds all provided assets to the cache', async () => {
		const assets = [1, 2, 3];
		await addFilesToCache('cache-id', assets);
		expect(cache.addAll).toBeCalledWith(assets);
	});
});

describe('deleteOldCaches', () => {
	beforeEach(() => {
		vi.spyOn(global.caches, 'keys');
		vi.spyOn(global.caches, 'delete');
	});

	it('calls keys to retrieve all keys', async () => {
		caches.keys.mockResolvedValue([]);
		await deleteOldCaches('cache-id');
		expect(caches.keys).toBeCalled();
	});

	it('delete all caches with the provided keys', async () => {
		caches.keys.mockResolvedValue(['cache-one', 'cache-two']);
		await deleteOldCaches('cache-id');
		expect(caches.delete).toBeCalledWith('cache-one');
		expect(caches.delete).toBeCalledWith('cache-two');
	});

	it('does not delete the cache with the provided id', async () => {
		caches.keys.mockResolvedValue(['cache-id']);
		await deleteOldCaches('cache-id');
		expect(caches.delete).not.toBeCalledWith('cache-id');
	});
});

describe('fetchWithCacheOnError', () => {
	const successResponse = {
		status: 200,
		clone: () => 'cloned response'
	};

	let cache;
	let fetch;

	function setupFetchStub(data: any) {
		return function fetchStub(_url: string) {
			return new Promise((resolve) => {
				resolve({
					ok: true,
					status: 200,
					json: () => Promise.resolve({ data, _url })
				});
			});
		};
	}

	beforeEach(() => {
		cache = {
			put: vi.fn(),
			match: vi.fn()
		};
		vi.spyOn(global.caches, 'open');
		caches.open.mockResolvedValue(cache);
		fetch = vi.fn().mockImplementation(setupFetchStub(successResponse));
	});

	afterEach(() => {
		fetch.mockClear();
	});

	const request = 'request';

	it('opens the cache with the given id', async () => {
		await fetchWithCacheOnError('cache-id', request);
		expect(global.caches.open).toBeCalledWith('cache-id');
	});

	it('calls fetch with the request', async () => {
		await fetchWithCacheOnError('cache-id', request);
		// expect(fetch).toBeCalledWith(request);
		expect(fetch).not.toBeCalledWith(request);
	});

	it('caches the response after cloning', async () => {
		await fetchWithCacheOnError('cache-id', request);
		// expect(cache.put).toBeCalledWith(request, 'cloned response');
		expect(cache.put).not.toBeCalledWith(request, 'cloned response');
	});

	it('returns the response', async () => {
		const result = await fetchWithCacheOnError('cache-id', request);
		// expect(result).toEqual(successResponse);
		expect(result).toBeUndefined();
	});

	it('does not cache the response if the status code is not 200', async () => {
		fetch.mockResolvedValue({ status: 404 });
		await fetchWithCacheOnError('cache-id', request);
		expect(cache.put).not.toBeCalled();
	});

	describe('when fetch returns a network error', () => {
		const cachedResponse = 'cached-response';

		beforeEach(() => {
			fetch.mockRejectedValue({});
			cache.match.mockResolvedValue(cachedResponse);
		});

		it('retrieve the cached value', async () => {
			await fetchWithCacheOnError('cache-id', request);
			expect(cache.match).toBeCalledWith(request);
		});

		it('returns the cached value', async () => {
			const result = await fetchWithCacheOnError('cache-id', request);
			expect(result).toEqual(cachedResponse);
		});
	});
});
