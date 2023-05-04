<script lang="ts">
	import type { Item } from '$lib/constants/constants';
	import { birthdays } from '$src/stores/birthdays';

	const currentDate = new Date();

	let nextBirthday: { nextBirthdayTime: number; who: Partial<Item> } = {
		nextBirthdayTime: -1,
		who: {}
	};

	const toNextBirthdayTime = (dob: string): number => {
		const birthdayThisYear = new Date(dob);
		birthdayThisYear.setFullYear(currentDate.getFullYear());
		if (birthdayThisYear.getTime() > currentDate.getTime()) {
			return birthdayThisYear.getTime();
		} else {
			const birthdayNextYear = new Date(dob);
			birthdayNextYear.setFullYear(currentDate.getFullYear() + 1);
			return birthdayNextYear.getTime();
		}
	};

	const findNextBirthday = (birthdays: Array<Partial<Item>>) =>
		birthdays.reduce(
			({ nextBirthdayTime, who }, thisBirthday) => {
				const thisBirthdayTime = toNextBirthdayTime(thisBirthday.dob || '');
				if (nextBirthdayTime === null || thisBirthdayTime < nextBirthdayTime) {
					return {
						nextBirthdayTime: thisBirthdayTime,
						who: thisBirthday
					};
				}
				return { nextBirthdayTime, who };
			},
			{ nextBirthdayTime: -1, who: {} }
		);

	const formatTime = (time: number): string => new Date(time).toISOString().substring(0, 10);

	$: nextBirthday = findNextBirthday($birthdays);
</script>

{#if nextBirthday.who}
	<div class="nextBirthday">
		<strong>{nextBirthday.who.name}</strong> has the next birthday, on
		<strong>{formatTime(nextBirthday.nextBirthdayTime)}</strong>.
	</div>
{/if}

<style>
	.nextBirthday {
		margin: 1rem 0;
	}
</style>
