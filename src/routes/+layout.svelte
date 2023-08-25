<script lang="ts">
	import { Config } from '$lib/types/config';
	import { onMount } from 'svelte';
	import { breakDuration$, workingDuration$ } from '../stores';

	let ready = false;

	onMount(() => {
		const configJson = localStorage.getItem('config');

		try {
			if (configJson) {
				const result = Config.safeParse(JSON.parse(configJson));

				if (result.success) {
					const config = result.data;

					workingDuration$.set(config.workingDuration);
					breakDuration$.set(config.breakDuration);
				}
			}
		} finally {
			ready = true;
		}
	});
</script>

{#if ready}
	<slot />
{/if}
