import * as crypto from 'crypto';
import type { Item } from '$lib/constants/constants';

const db = new Map();

export const addNew = (item: Item) => {
	const id = crypto.randomUUID();
	db.set(id, { ...item, id });
};

export const replace = (id: string, item: Item) => db.set(id, { ...item, id });

export const has = (id: string) => db.has(id);

export const getAll = () => Array.from(db.values());

export const clear = () => db.clear();
