import { expect } from 'vitest';
import { EOL } from 'os';

// received:  ActionFailure { status: 422, data: <whatever passed in body> { a: 'b' } }
// expected:  whatever passed in body e.g. { a: 'b' }
export function toBeUnprocessableEntity(
	received,
	expected = {}
): {
	pass: boolean;
	message: () => string;
} {
	if (received.status !== 422) {
		return {
			pass: false,
			message: () =>
				`Expected 422 status code but got ${received.status}` +
				EOL +
				this.utils.diff(expected, received.data)
		};
	}

	if (!this.equals(received.data, expect.objectContaining(expected))) {
		return {
			pass: false,
			message: () => `Response body was not equal:` + EOL + this.utils.diff(expected, received.data)
		};
	}

	if (!received.data) {
		return {
			pass: true,
			message: () => 'Expected non-422 status code but got 422' + EOL
		};
	}

	return {
		pass: true,
		message: () =>
			`Expected non-422 status code but got 422 with body:` +
			EOL +
			this.utils.stringify(received.data)
	};
}
