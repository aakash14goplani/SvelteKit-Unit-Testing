import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ fetch, parent }) => {
	const { session } = await parent();
	if (!session?.user) throw redirect(303, '/login');
	const result = await fetch('/api/birthdays');
	return result.json();
};

export const actions = {
	default: async ({ request, fetch, locals }) => {
		const session = await locals.getSession();
		if (!session?.user) return fail(401);

		const data = await request.formData();
		const id = data.get('id')?.toString() || '';
		const dob = data.get('dob')?.toString() || '';
		const name = data.get('name')?.toString() || '';

		let response;
		if (id) {
			response = await fetch(`/api/birthday/${id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, dob })
			});
		} else {
			response = await fetch('/api/birthdays', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, dob })
			});
		}

		if (!response.ok) {
			const { message } = await response.json();
			return fail(422, {
				id,
				name,
				dob,
				error: message
			});
		}
	}
};
