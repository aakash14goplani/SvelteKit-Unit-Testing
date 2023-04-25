<script lang="ts">
	export let form: any = undefined;
</script>

{#if form?.error}
	<p class="error">{form.error}</p>
{/if}

<form name="birthday" method="POST">
	{#if form?.id}
		<input type="hidden" name="id" value={form.id} />
	{/if}
	<label>
		Name
		<input type="text" name="name" value={form?.name || ''} />
	</label>

	<label>
		Date of birth
		<input type="text" name="dob" value={form?.dob || ''} />
	</label>

	<input type="submit" value="Save" />
</form>

<style>
	.error {
		color: red;
	}
</style>
