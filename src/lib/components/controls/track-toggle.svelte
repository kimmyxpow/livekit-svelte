<script lang="ts">
	import { Track } from 'livekit-client';
	import type { Snippet } from 'svelte';
	import { useTrackToggle } from '../../hooks/use-track-toggle.svelte.js';

	interface Props {
		source: Track.Source;
		class?: string;
		children?: Snippet<[enabled: boolean, pending: boolean]>;
	}

	let { source, class: className = '', children }: Props = $props();

	const { enabled, toggle, pending } = useTrackToggle(() => ({ source }));
</script>

<button
	class="lk-track-toggle {className}"
	class:lk-enabled={enabled}
	class:lk-pending={pending}
	onclick={toggle}
	disabled={pending}
	aria-pressed={enabled}
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
