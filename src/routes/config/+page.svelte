<script lang="ts">
	import { get } from 'svelte/store';
	import { workingDuration$, breakDuration$ } from '../../stores';
	import DurationInput from '../../components/DurationInput.svelte';
	import type { Config } from '$lib/types/config';

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
	<div>
		<a href="/">戻る</a>
	</div>
	<div>
		<div>作業</div>
		<div>
			<DurationInput bind:duration={workingDuration} />
		</div>
	</div>
	<div>
		<div>休憩</div>
		<div>
			<DurationInput bind:duration={breakDuration} />
		</div>
	</div>
	<div>
		<button on:click={configure}>設定</button>
	</div>
</div>
