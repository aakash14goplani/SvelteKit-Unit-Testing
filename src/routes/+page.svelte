<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(() => goto('/login'));
</script>

<svelte:head>
	<title>Home Page</title>
</svelte:head>

<h1>Birthday Listing Application</h1>
