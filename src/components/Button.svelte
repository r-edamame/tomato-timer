<script lang="ts">
	export let type: 'button' | 'submit' | null = 'button';
</script>

<button class="btn" {type} on:click>
	<slot />
</button>

<style>
	.btn {
		width: 100%;
		padding: 1rem 0;
		font-size: 2rem;
		color: #555;

		background-color: #ddeeff;

		border-radius: 10px;
		border: 3px solid #aaccff;
	}
	.btn:hover {
		border: 3px solid #aaa;
	}
</style>
