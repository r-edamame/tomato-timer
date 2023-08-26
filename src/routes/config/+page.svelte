<script lang="ts">
	import { get } from 'svelte/store';
	import { workingDuration$, breakDuration$ } from '../../stores';
	import DurationInput from '../../components/DurationInput.svelte';
	import type { Config } from '$lib/types/config';
	import { base } from '$app/paths';
	import Button from '../../components/Button.svelte';

	let workingDuration = get(workingDuration$);
	let breakDuration = get(breakDuration$);

	const configure = () => {
		workingDuration$.set(workingDuration);
		breakDuration$.set(breakDuration);

		const config: Config = {
			workingDuration: workingDuration,
			breakDuration: breakDuration
		};
		localStorage.setItem('config', JSON.stringify(config));
	};
</script>

<div>
	<div class="config-item">
		<div class="config-title">作業</div>
		<div>
			<DurationInput bind:duration={workingDuration} />
		</div>
	</div>
	<div class="config-item">
		<div class="config-title">休憩</div>
		<div>
			<DurationInput bind:duration={breakDuration} />
		</div>
	</div>
	<div>
		<Button on:click={configure}>設定</Button>
	</div>
	<div class="back">
		<a href="{base}/">戻る</a>
	</div>
</div>

<style>
	.config-title {
		font-size: 1.5rem;
	}

	.config-item {
		text-align: center;

		padding-bottom: 2rem;
	}

	.back {
		padding-top: 1rem;
		text-align: center;
		font-size: 1.5rem;
	}
</style>
