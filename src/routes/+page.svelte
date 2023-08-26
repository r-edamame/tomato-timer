<script lang="ts">
	import type { Status } from '$lib/types/status';
	import { onMount } from 'svelte';
	import {
		breakDuration$,
		currentStatus$,
		elapsedSeconds$,
		totalWorkedTime$,
		workingDuration$
	} from '../stores';
	import { get } from 'svelte/store';
	import { Duration, getSeconds } from '$lib/types/time';
	import { base } from '$app/paths';

	let status: Status;

	let breakBgm: HTMLAudioElement;
	let tickSound: HTMLAudioElement;

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

	let fadeIntervalId: number | null = null;
	const fadeIn = (audio: HTMLAudioElement) => {
		if (fadeIntervalId) {
			clearInterval(fadeIntervalId);
		}
		audio.volume = 0;
		const intId = setInterval(() => {
			if (audio.volume < 0.998) {
				audio.volume += 0.001;
			}
		}, 10);
		setTimeout(() => {
			clearInterval(intId);
			fadeIntervalId = null;
		}, 2000);
		fadeIntervalId = intId;
		audio.play();
	};
	const fadeOut = (audio: HTMLAudioElement) => {
		if (fadeIntervalId) {
			clearInterval(fadeIntervalId);
		}
		const intId = setInterval(() => {
			if (audio.volume > 0.001) {
				audio.volume -= 0.001;
			}
		}, 10);
		setTimeout(() => {
			audio.pause();
			audio.currentTime = 0;
			fadeIntervalId && clearInterval(fadeIntervalId);
			fadeIntervalId = null;
		}, 2000);
		fadeIntervalId = intId;
	};

	onMount(() => {
		breakBgm = new Audio(`${base}/sounds/break-bgm1.mp3`);
		breakBgm.loop = true;
		tickSound = new Audio(`${base}/sounds/tick.mp3`);
		tickSound.volume = 0.2;

		currentStatus$.subscribe((s) => {
			status = s;

			switch (s) {
				case 'waiting':
					breakBgm.pause();
					breakBgm.currentTime = 0;
					break;
				case 'working':
					fadeOut(breakBgm);
					break;
				case 'break':
					fadeIn(breakBgm);
					localStorage.setItem('totalWorkedTime', String(get(totalWorkedTime$)));
					break;
			}
		});

		elapsedSeconds$.subscribe((seconds) => {
			switch (status) {
				case 'working':
					seconds > 0 && totalWorkedTime$.update((n) => n + 1);
					if (seconds >= getSeconds(get(workingDuration$))) {
						currentStatus$.set('break');
						elapsedSeconds$.set(0);
					} else if (seconds > 0) {
						tickSound.currentTime = 0;
						tickSound.play();
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

		breakBgm.pause();
		breakBgm.currentTime = 0;

		clearInterval(intervalId);
		localStorage.setItem('totalWorkedTime', String(get(totalWorkedTime$)));
	};
</script>

<div>
	<a href="{base}/config">config</a>
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
			残り {calcRemain(
				$elapsedSeconds$,
				status === 'working' ? $workingDuration$ : $breakDuration$
			)}
		</div>
	{/if}
</div>
<div>
	<div>総稼働時間</div>
	<div>
		{toHMS($totalWorkedTime$)}
	</div>
</div>
