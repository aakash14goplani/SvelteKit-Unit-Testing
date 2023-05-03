<script lang="ts">
	import { signIn, signOut } from '@auth/sveltekit/client';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { PageData } from '../$types';

	export let data: PageData;

	onMount(() => {
		if ($page.data.session) {
			window.sessionStorage.setItem('user', JSON.stringify($page.data.session));
		}
	});

	function handleLogout() {
		window.sessionStorage.removeItem('user');
		signOut();
	}
</script>

<svelte:head>
	<title>Login Page</title>
</svelte:head>

<div>
	{#if $page.data.session}
		<h1>Welcome {$page.data.session.user?.name ?? 'User'}</h1>
		<span class="signedInText">
			<img src={$page.data.session.user?.avatar_url} alt="user-profile" class="image" />
		</span>
		<button on:click={handleLogout} class="button">Sign out</button> |
		<button on:click={() => goto('/birthdays')}>View Birthday List</button>
	{:else}
		<h1>Please login</h1>
		<span class="notSignedInText">You are not signed in</span>
		{#each data.providers as authProvider}
			<button on:click={() => signIn(authProvider)}>
				Sign in with {authProvider}
			</button>
		{/each}
	{/if}
</div>

<style>
	.image {
		max-width: 7rem;
		max-height: 7rem;
		display: block;
		margin: 1rem 0;
	}
</style>
