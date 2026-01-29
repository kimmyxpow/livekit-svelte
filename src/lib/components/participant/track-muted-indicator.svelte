<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { TrackReferenceOrPlaceholder } from '@livekit/components-core';
	import { Track } from 'livekit-client';
	import { useTrackMutedIndicator } from '../../hooks/use-track-muted-indicator.svelte.js';
	import { ensureTrackRef } from '../../context/track-ref-context.svelte.js';

	interface Props {
		trackRef?: TrackReferenceOrPlaceholder;
		source?: Track.Source;
		class?: string;
		children?: Snippet;
	}

	let { trackRef, source, class: className = '', children }: Props = $props();

	const tr = $derived(ensureTrackRef(trackRef));
	const isMuted = useTrackMutedIndicator(() => tr);

	const isActuallyMuted = $derived(source ? tr.source === source && isMuted : isMuted);
</script>

{#if isActuallyMuted}
	<span class={className}>
		{#if children}
			{@render children()}
		{:else}
			Muted
		{/if}
	</span>
{/if}
