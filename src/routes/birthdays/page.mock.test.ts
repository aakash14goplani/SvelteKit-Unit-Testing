import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import Birthday from './Birthday.svelte';
import BirthdayForm from './BirthdayForm.svelte';
import { createBirthday } from '../../../test/factories/birthday';
import Page from './+page.svelte';

vi.mock('./Birthday.svelte', async () => ({
	default: componentDouble('Birthday')
}));
vi.mock('./BirthdayForm.svelte', async () => ({
	default: componentDouble('BirthdayForm')
}));

describe('/birthdays', () => {
	beforeEach(Birthday.reset);
	beforeEach(BirthdayForm.reset);

	const birthdays = [
		createBirthday('Hercules', '1994-02-02', {
			id: '123'
		}),
		createBirthday('Athena', '1989-01-01', {
			id: '234'
		})
	];

	const firstEditButton = () =>
		screen.queryAllByRole('button', {
			name: 'Edit'
		})[0];

	it('displays a Birthday component for each birthday', () => {
		render(Page, { data: { birthdays } });
		expect(Birthday).toBeRenderedWithProps({
			name: 'Hercules',
			dob: '1994-02-02',
			id: '123'
		});
		expect(Birthday).toBeRenderedWithProps({
			name: 'Athena',
			dob: '1989-01-01',
			id: '234'
		});
	});

	it('displays the Birthdays in the same order as the props passed in', () => {
		render(Page, { data: { birthdays } });
		expect(Birthday.propsOfAllInstances()).toEqual([
			expect.objectContaining({ name: 'Hercules' }),
			expect.objectContaining({ name: 'Athena' })
		]);
	});

	it('passes the currently edited birthday to the BirthdayForm component', async () => {
		render(Page, { data: { birthdays } });

		const user = userEvent.setup();
		await user.click(firstEditButton());

		expect(BirthdayForm).toBeRenderedWithProps({
			form: birthdays[0]
		});
	});

	it('cancels editing', async () => {
		render(Page, { data: { birthdays } });

		const user = userEvent.setup();
		await user.click(firstEditButton());

		await BirthdayForm.dispatch('cancel');

		expect(BirthdayForm).not.toBeRenderedWithProps({
			form: birthdays[0]
		});
	});
});
