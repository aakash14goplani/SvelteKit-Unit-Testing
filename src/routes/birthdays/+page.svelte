<script lang="ts">
	import { goto } from '$app/navigation';
	import { birthdays } from '$src/stores/birthdays';
	import Birthday from './Birthday.svelte';
	import BirthdayForm from './BirthdayForm.svelte';
	import NextBirthday from './NextBirthday.svelte';

	export let data;
	export let form: any = undefined;

	$: birthdays.set(data.birthdays);

	let editing = form?.id ? form : null;
</script>

<svelte:head>
	<title>Birthday Listing Page</title>
</svelte:head>

<h1>Birthday list</h1>
{#if $birthdays && $birthdays.length > 0}
	<NextBirthday />
{/if}
<button on:click={() => goto('/login')}>Home Page</button>
<ol>
	{#each data.birthdays as birthday}
		<li>
			{#if editing !== undefined && editing?.id == birthday.id}
				<BirthdayForm form={editing} on:cancel={() => (editing = null)} />
			{:else}
				<Birthday {...birthday} />
			{/if}
			{#if !editing}
				<button on:click={() => (editing = birthday)}>Edit</button>
			{/if}
		</li>
	{/each}
</ol>

{#if !editing}
	<h1>Add a new birthday</h1>
	<div>
		<BirthdayForm {form} />
	</div>
{/if}

<style>
	ol {
		list-style-type: none;
		padding-left: 0;
	}

	li,
	div {
		padding: 10px;
		margin: 5px;
		border: 1px solid #ccc;
		border-radius: 2px;
	}
</style>
