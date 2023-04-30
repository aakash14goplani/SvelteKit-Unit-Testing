import { addNew, getAll } from '$lib/server/birthdayRepository';
import { json, error } from '@sveltejs/kit';

export const POST = async ({ request }) => {
	const { name, dob } = await request.json();
	const result = addNew({ name, dob });
	if (result.error) {
		throw error(422, result.error);
	}

	try {
		return json(result);
	} catch (error) {
		return result;
	}
};

export const GET = () => {
	try {
		return json({ birthdays: getAll() });
	} catch (error) {
		return JSON.stringify({ birthdays: getAll() });
	}
};
