<script lang="ts">
	import { Config } from '$lib/types/config';
	import { onMount } from 'svelte';
	import { breakDuration$, totalWorkedTime$, workingDuration$ } from '../stores';
	import Container from '../components/Container.svelte';

	let ready = false;

	onMount(() => {
		const total = localStorage.getItem('totalWorkedTime');
		if (total !== null) {
			totalWorkedTime$.set(Number(total));
		}

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
	<Container>
		<div>
			<h1>🍅タイマー</h1>
		</div>
		<slot />
	</Container>
{/if}

<style>
	h1 {
		text-align: center;
	}
</style>
