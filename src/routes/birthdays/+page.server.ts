import { fail } from '@sveltejs/kit';
import { addNew, replace, getAll, has } from '$lib/server/birthdayRepository';

addNew({ name: 'Hercules', dob: '1994-02-02' });
addNew({ name: 'Athena', dob: '1989-01-01' });

export const load = () => ({
	birthdays: getAll()
});

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const id = data.get('id')?.toString() || '';
		const dob = data.get('dob')?.toString() || '';
		const name = data.get('name')?.toString() || '';

		if (empty(name)) {
			return fail(422, {
				id,
				dob,
				error: 'Please provide a name.'
			});
		}

		if (invalidDob(dob)) {
			return fail(422, {
				id,
				name,
				dob,
				error: 'Please provide a date of birth in the YYYY-MM-DD format.'
			});
		}

		if (id && !has(id)) {
			return fail(422, {
				error: 'An unknown ID was provided.'
			});
		}

		if (id) {
			replace(id, {
				name,
				dob
			});
		} else {
			addNew({ name, dob });
		}
	}
};

const empty = (value: string) => value === undefined || value === null || value.trim() === '';

const invalidDob = (dob: string) => isNaN(Date.parse(dob));
