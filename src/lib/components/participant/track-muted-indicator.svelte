<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { TrackReferenceOrPlaceholder } from '@livekit/components-core';
	import { Track } from 'livekit-client';
	import { useTrackMutedIndicator } from '../../hooks/use-track-muted-indicator.svelte.js';
	import { ensureTrackRef } from '../../context/track-ref-context.svelte.js';
	import { getSourceIcon } from '../../assets/icons/util.js';

	interface Props {
		trackRef?: TrackReferenceOrPlaceholder;
		source?: Track.Source;
		show?: 'always' | 'muted' | 'unmuted';
		class?: string;
		children?: Snippet;
	}

	let { trackRef, source, show = 'always', class: className = '', children }: Props = $props();

	const tr = $derived(ensureTrackRef(trackRef));
	const isMuted = useTrackMutedIndicator(() => tr);

	const isActuallyMuted = $derived(source ? tr.source === source && isMuted : isMuted);

	const showIndicator = $derived(
		show === 'always' ||
			(show === 'muted' && isActuallyMuted) ||
			(show === 'unmuted' && !isActuallyMuted)
	);

	const IconComponent = $derived(getSourceIcon(tr.source, !isActuallyMuted));
</script>

{#if showIndicator}
	<span class={className} data-lk-muted={isActuallyMuted}>
		{#if children}
			{@render children?.()}
		{:else if IconComponent}
			{@const Icon = IconComponent}
			<Icon />
		{/if}
	</span>
{/if}
