<script lang="ts">
	import { Duration, getSeconds } from '$lib/types/time';

	export let status: 'working' | 'break';
	export let duration: Duration;
	export let elapsed: number;

	const toHMS = (sec: number) => {
		const h = Math.floor(sec / 60 / 60);
		const m = Math.floor(sec / 60) % 60;
		const s = sec % 60;

		const pad = (n: number) => String(n).padStart(2, '0');
		return `${pad(h)}:${pad(m)}:${pad(s)}`;
	};

	const calcRemain = (elapsed: number, duration: Duration): string => {
		const seconds = getSeconds(duration);
		const remSec = seconds - elapsed;

		return toHMS(remSec);
	};
</script>

<div>
	<div class="status-view">
		{status === 'working' ? '作業中' : '休憩'}
	</div>
	<div class="timer-view">
		{calcRemain(elapsed, duration)}
	</div>
</div>

<style>
	.status-view {
		text-align: center;
		font-size: 1rem;
	}

	.timer-view {
		text-align: center;
		font-weight: bold;
		font-size: 2rem;
	}
</style>
