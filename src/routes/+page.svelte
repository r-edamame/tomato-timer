<script lang="ts">
	import type { Status } from '$lib/types/status';
	import { onMount } from 'svelte';
	import {
		breakDuration$,
		currentStatus$,
		elapsedSeconds$,
		soundVolume$,
		totalWorkedTime$,
		workingDuration$
	} from '../stores';
	import { get } from 'svelte/store';
	import { Duration, getSeconds } from '$lib/types/time';
	import { base } from '$app/paths';
	import Button from '../components/Button.svelte';
	import Timer from '../components/Timer.svelte';
	import { BgmController } from '$lib/sounds/bgm-controller';

	let status: Status;

	let tickSound: HTMLAudioElement;
	let bgm: BgmController;

	onMount(() => {
		bgm = new BgmController([`${base}/sounds/break-bgm1.mp3`, `${base}/sounds/rain.mp3`]);
		tickSound = new Audio(`${base}/sounds/tick.mp3`);
		tickSound.volume = 0.2;

		currentStatus$.subscribe((s) => {
			status = s;

			switch (s) {
				case 'waiting':
					bgm.pause();
					break;
				case 'working':
					bgm.fadeOut(2);
					break;
				case 'break':
					bgm.fadeIn(2);
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

		soundVolume$.subscribe((volume) => {
			const actual = volume / 100;
			tickSound.volume = actual;
			bgm.setVolume(actual);
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

		bgm.pause();

		clearInterval(intervalId);
		localStorage.setItem('totalWorkedTime', String(get(totalWorkedTime$)));
	};
</script>

<div>
	{#if status === 'waiting'}
		<Button on:click={startTimer}>開始</Button>
	{:else}
		<Button on:click={stopTimer}>終了</Button>
	{/if}
</div>
<div class="main">
	{#if status !== 'waiting'}
		<Timer
			{status}
			elapsed={$elapsedSeconds$}
			duration={status === 'working' ? $workingDuration$ : $breakDuration$}
		/>
	{/if}
</div>
<div class="config">
	<a href="{base}/config">設定</a>
</div>

<style>
	.main {
		padding: 3rem 0;
	}
	.config {
		text-align: center;
		font-size: 1.5rem;
	}
</style>
