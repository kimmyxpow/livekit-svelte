<script lang="ts">
	import type { ToggleSource } from '@livekit/components-core';
	import type { Snippet } from 'svelte';
	import { useTrackToggle } from '../../hooks/use-track-toggle.svelte.js';

	interface Props<T extends ToggleSource> {
		source: T;
		showIcon?: boolean;
		initialState?: boolean;
		class?: string;
		children?: Snippet<[enabled: boolean, pending: boolean]>;
	}

	let {
		source,
		showIcon: _showIcon = true,
		initialState,
		class: className = '',
		children
	}: Props<ToggleSource> = $props();

	const { enabled, toggle, pending, buttonProps } = useTrackToggle(() => ({
		source,
		initialState
	}));
</script>

<button
	class="lk-track-toggle {buttonProps.className} {className}"
	class:lk-enabled={enabled}
	class:lk-pending={pending}
	data-lk-source={buttonProps['data-lk-source']}
	data-lk-enabled={buttonProps['data-lk-enabled']}
	onclick={() => toggle()}
	disabled={buttonProps.disabled}
	aria-pressed={buttonProps['aria-pressed']}
>
	{#if children}
		{@render children(enabled, pending)}
	{:else}
		{enabled ? 'Disable' : 'Enable'} {source}
	{/if}
</button>

<style>
	.lk-track-toggle {
		padding: 8px 16px;
		border-radius: 4px;
		border: none;
		background: #444;
		color: white;
		cursor: pointer;
		transition: background 0.2s;
	}

	.lk-track-toggle:hover:not(:disabled) {
		background: #555;
	}

	.lk-track-toggle.lk-enabled {
		background: #0a84ff;
	}

	.lk-track-toggle:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
