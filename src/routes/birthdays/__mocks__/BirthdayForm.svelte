<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let form: any;

	const dispatcher = createEventDispatcher();
</script>

<div data-testid="BirthdayForm">
	Editing {JSON.stringify(form)}

	<button on:click={() => dispatcher('cancel')} />
</div>
