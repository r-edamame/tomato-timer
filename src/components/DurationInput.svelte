<script lang="ts">
	import type { Duration, DurationType } from '$lib/types/time';
	import { onMount } from 'svelte';

	export let duration: Duration;

	let value: number;
	let type: DurationType;

	onMount(() => {
		value = duration.value;
		type = duration.durType;
	});

	const change = () => {
		duration = {
			durType: type,
			value: value
		};
	};
</script>

<input type="number" bind:value on:input={change} />
<select bind:value={type} on:change={change}>
	<option value="minute">分</option>
	<option value="second">秒</option>
</select>

<style>
	input {
		padding: 0.5rem 0;
		font-size: 1.5rem;

		border-top-left-radius: 10px;
		border-bottom-left-radius: 10px;

		border: 1px solid #aaa;

		width: 7rem;

		text-align: right;
	}

	select {
		font-size: 1.5rem;

		padding: 0.5rem 0.5rem;

		border-top-right-radius: 10px;
		border-bottom-right-radius: 10px;
		border: 1px solid #aaa;
	}
</style>
