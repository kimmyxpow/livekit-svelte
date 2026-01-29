<script lang="ts">
	import type { ToggleSource } from '@livekit/components-core';
	import type { Snippet } from 'svelte';
	import { useTrackToggle } from '../../hooks/use-track-toggle.svelte.js';
	import { getSourceIcon } from '../../assets/icons/util.js';
	import { onMount } from 'svelte';

	interface Props<T extends ToggleSource> {
		source: T;
		showIcon?: boolean;
		initialState?: boolean;
		class?: string;
		children?: Snippet<[enabled: boolean, pending: boolean]>;
	}

	let {
		source,
		showIcon = true,
		initialState,
		class: className = '',
		children
	}: Props<ToggleSource> = $props();

	let isClient = $state(false);

	onMount(() => {
		isClient = true;
	});

	const { enabled, toggle, pending, buttonProps } = useTrackToggle(() => ({
		source,
		initialState
	}));

	const IconComponent = $derived(getSourceIcon(source, enabled));
</script>

{#if isClient}
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
		{#if showIcon && IconComponent}
			{@const Icon = IconComponent}
			<Icon />
		{/if}
		{#if children}
			{@render children(enabled, pending)}
		{/if}
	</button>
{/if}

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
