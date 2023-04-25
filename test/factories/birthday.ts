export const createBirthday = (name: string, dob: string, extra = {}) => ({
	name,
	dob,
	...extra
});
