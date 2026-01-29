<script lang="ts">
	import type { Snippet } from 'svelte';
	import { useSettingsToggle } from '../../hooks/use-settings-toggle.svelte.js';

	interface Props {
		class?: string;
		children?: Snippet;
	}

	let { class: className = '', children }: Props = $props();

	const { mergedProps } = useSettingsToggle({ props: () => ({ class: className }) });
</script>

<button
	class={mergedProps.className}
	onclick={mergedProps.onclick}
	aria-pressed={mergedProps['aria-pressed']}
>
	{#if children}
		{@render children()}
	{:else}
		Settings
	{/if}
</button>

<style>
	.lk-button {
		padding: 8px 16px;
		border-radius: 4px;
		border: none;
		background: #444;
		color: white;
		cursor: pointer;
		transition: background 0.2s;
	}

	.lk-button:hover {
		background: #555;
	}
</style>
