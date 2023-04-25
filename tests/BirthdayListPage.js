// This file has to be js else playwright test ill break
export class BirthdayListPage {
	constructor(page) {
		this.page = page;
	}

	goto = async () => {
		await this.page.goto('/birthdays');
	};

	saveNameAndDateOfBirth = async (name, dob) => {
		await this.nameField().fill(name);
		await this.dateOfBirthField().fill(dob);
		await this.saveButton().click();
	};

	beginEditingFor = async (name) =>
		this.entryFor(name).getByRole('button', { name: 'Edit' }).click();

	entryFor = (name) => this.page.getByRole('listitem').filter({ hasText: name });

	dateOfBirthField = () => this.page.getByLabel('Date of birth');

	nameField = () => this.page.getByLabel('Name');

	saveButton = () => this.page.getByRole('button', { name: 'Save' });
}
