import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { createBirthday } from '../../../test/factories/birthday';
import Page from './+page.svelte';

vi.mock('./Birthday.svelte');
vi.mock('./BirthdayForm.svelte');

describe('/birthdays', () => {
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
		expect(screen.getAllByText(/Hercules/)[0]).toBeVisible();
		expect(screen.getAllByText(/1994-02-02/)[0]).toBeVisible();
		expect(screen.getAllByText(/Athena/)[0]).toBeVisible();
		expect(screen.getAllByText(/1989-01-01/)[0]).toBeVisible();
	});

	it('displays the Birthdays in the same order as the props passed in', () => {
		render(Page, { data: { birthdays } });
		const birthdayEls = screen.queryAllByTestId('Birthday');
		expect(birthdayEls[0]).toHaveTextContent(/Hercules/);
		expect(birthdayEls[1]).toHaveTextContent(/Athena/);
	});

	it('passes the currently edited birthday to the BirthdayForm component', async () => {
		render(Page, { data: { birthdays } });

		const user = userEvent.setup();
		await user.click(firstEditButton());

		expect(screen.queryByText(`Editing ${JSON.stringify(birthdays[0])}`)).toBeInTheDocument();
	});

	it('cancels editing', async () => {
		render(Page, { data: { birthdays } });

		const user = userEvent.setup();
		await user.click(firstEditButton());

		const button = screen.getByTestId('BirthdayForm').querySelector('button');
		if (button) await user.click(button);

		expect(screen.queryByText(`Editing ${JSON.stringify(birthdays[0])}`)).not.toBeInTheDocument();
	});
});
