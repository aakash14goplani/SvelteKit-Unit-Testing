import * as crypto from 'crypto';
import type { Item } from '../constants/constants';

const db = new Map();

export const addNew = (item: Item) => {
	const validationResult = validate(item);
	if (validationResult) {
		return validationResult;
	}

	return set(crypto.randomUUID(), item);
};

export const replace = (id: string, item: Item) => {
	if (!has(id)) {
		return { error: 'An unknown ID was provided.' };
	}

	const validationResult = validate(item);
	if (validationResult) {
		return validationResult;
	}

	return set(id, item);
};

export const has = (id: string) => db.has(id);

export const getAll = () => Array.from(db.values());

export const clear = () => db.clear();

const set = (id: string, item: Item) => {
	const itemWithId = { ...item, id };
	db.set(id, itemWithId);
	return itemWithId;
};

const empty = (value: string) => value === undefined || value === null || value.trim() === '';

const invalidDob = (dob: string) => isNaN(Date.parse(dob));

const validate = ({ name, dob }: { name: string; dob: string }) => {
	if (empty(name)) {
		return { error: 'Please provide a name.' };
	}

	if (invalidDob(dob)) {
		return {
			error: 'Please provide a date of birth in the YYYY-MM-DD format.'
		};
	}
};
