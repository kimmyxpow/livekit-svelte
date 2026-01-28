<script lang="ts">
	import type { TrackReferenceOrPlaceholder } from '@livekit/components-core';
	import type { Snippet } from 'svelte';
	import { ensureTrackRef } from '../../context/track-ref-context.svelte.js';
	import { ensureLayoutContext } from '../../context/layout-context.svelte.js';

	interface Props {
		trackRef?: TrackReferenceOrPlaceholder;
		class?: string;
		children?: Snippet<[isPinned: boolean]>;
	}

	let { trackRef, class: className = '', children }: Props = $props();

	const layout = ensureLayoutContext();

	let isPinned = $state(false);

	$effect(() => {
		const tr = ensureTrackRef(trackRef);
		const unsubscribe = layout.pin.subscribe((state) => {
			isPinned = state.some(
				(p) => p.participant.identity === tr.participant.identity && p.source === tr.source
			);
		});
		return unsubscribe;
	});

	function toggle() {
		const tr = ensureTrackRef(trackRef);
		layout.pin.update((state) => {
			const exists = state.some(
				(p) => p.participant.identity === tr.participant.identity && p.source === tr.source
			);
			if (exists) {
				return state.filter(
					(p) => !(p.participant.identity === tr.participant.identity && p.source === tr.source)
				);
			} else {
				return [...state, tr];
			}
		});
	}
</script>

<button
	class="lk-focus-toggle {className}"
	class:lk-pinned={isPinned}
	onclick={toggle}
	aria-pressed={isPinned}
>
	{#if children}
		{@render children(isPinned)}
	{:else}
		{isPinned ? 'Unpin' : 'Pin'}
	{/if}
</button>

<style>
	.lk-focus-toggle {
		padding: 8px 16px;
		border-radius: 4px;
		border: none;
		background: #444;
		color: white;
		cursor: pointer;
		transition: background 0.2s;
	}

	.lk-focus-toggle:hover {
		background: #555;
	}

	.lk-focus-toggle.lk-pinned {
		background: #0a84ff;
	}
</style>
