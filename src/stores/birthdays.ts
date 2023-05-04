import { writable } from 'svelte/store';
import type { Item } from '$lib/constants/constants';

export const birthdays = writable<Array<Partial<Item>>>([]);
