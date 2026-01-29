<script lang="ts">
	import type { Snippet } from 'svelte';
	import { ensureLayoutContext } from '../../context/layout-context.svelte.js';

	interface Props {
		class?: string;
		children?: Snippet;
	}

	let { class: className = '', children }: Props = $props();

	const layout = ensureLayoutContext();

	function clearPin() {
		layout.pin.state?.set([]);
	}
</script>

<button class="lk-clear-pin-button {className}" onclick={clearPin}>
	{#if children}
		{@render children()}
	{:else}
		Clear Pin
	{/if}
</button>

<style>
	.lk-clear-pin-button {
		padding: 8px 16px;
		border-radius: 4px;
		border: none;
		background: #444;
		color: white;
		cursor: pointer;
		transition: background 0.2s;
	}

	.lk-clear-pin-button:hover {
		background: #555;
	}
</style>
