import { describe, it, expect, beforeEach } from 'vitest';
import { PUT } from './+server';
import * as birthdayRepository from '../../../../lib/server/birthdayRepository';
import { createBirthday } from '../../../../../test/factories/birthday';
import { createRequest } from '../../../../../test/factories/request';

const storedId = () => birthdayRepository.getAll()[0].id;

const bodyOfResponse = (response) => {
	try {
		return JSON.parse(response);
	} catch (e) {
		return response;
	}
};

describe('PUT', () => {
	beforeEach(() => {
		birthdayRepository.clear();
		birthdayRepository.addNew(createBirthday('Hercules', '2009-03-01'));
	});

	it('updates the birthday in the store', async () => {
		await PUT({
			request: createRequest(createBirthday('Hercules', '1999-03-01')),
			params: { id: storedId() }
		});
		expect(birthdayRepository.getAll()).toHaveLength(1);
		expect(birthdayRepository.getAll()[0]).toContain(createBirthday('Hercules', '1999-03-01'));
	});

	it('returns a json response with the data', async () => {
		const response = await PUT({
			request: createRequest(createBirthday('Hercules', '1999-03-01')),
			params: { id: storedId() }
		});
		expect(await bodyOfResponse(response)).toContain(
			createBirthday('Hercules', '1999-03-01', {
				id: storedId()
			})
		);
	});

	it('throws an error if the data is invalid', async () => {
		expect.hasAssertions();
		try {
			await PUT({
				request: createRequest(createBirthday('Hercules', '')),
				params: { id: storedId() }
			});
		} catch (error) {
			expect(error.status).toEqual(422);
			expect(error.body).toEqual({
				message: 'Please provide a date of birth in the YYYY-MM-DD format.'
			});
		}
	});
});
