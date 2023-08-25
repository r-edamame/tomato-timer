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
