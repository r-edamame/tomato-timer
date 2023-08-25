<script lang="ts">
	import type { Status } from '$lib/types/status';
	import { onMount } from 'svelte';
	import { breakDuration$, currentStatus$, elapsedSeconds$, workingDuration$ } from '../stores';
	import { get } from 'svelte/store';
	import { getSeconds } from '$lib/types/time';

	let status: Status;

	onMount(() => {
		currentStatus$.subscribe((s) => {
			status = s;
		});

		elapsedSeconds$.subscribe((seconds) => {
			switch (status) {
				case 'working':
					if (seconds >= getSeconds(get(workingDuration$))) {
						currentStatus$.set('break');
						elapsedSeconds$.set(0);
					}
					break;
				case 'break':
					if (seconds >= getSeconds(get(breakDuration$))) {
						currentStatus$.set('working');
						elapsedSeconds$.set(0);
					}
			}
		});
	});

	let intervalId: number;

	const startTimer = () => {
		currentStatus$.set('working');

		elapsedSeconds$.set(0);

		intervalId = setInterval(() => {
			elapsedSeconds$.update((v) => v + 1);
		}, 1000);
	};
	const stopTimer = () => {
		currentStatus$.set('waiting');

		clearInterval(intervalId);
	};
</script>

<div>
	<a href="/config">config</a>
</div>
<div>
	{#if status === 'waiting'}
		<button on:click={startTimer}>start</button>
	{:else}
		<button on:click={stopTimer}>stop</button>
	{/if}
</div>
<div>
	{#if status !== 'waiting'}
		<div>
			{$currentStatus$}
		</div>
		<div>
			{$elapsedSeconds$}秒
		</div>
	{/if}
</div>
