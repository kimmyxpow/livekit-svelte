<script lang="ts">
	import type { TrackReferenceOrPlaceholder } from '@livekit/components-core';
	import type { Snippet } from 'svelte';
	import TrackLoop from '../track-loop.svelte';

	interface Props {
		trackReferences: TrackReferenceOrPlaceholder[];
		class?: string;
		children?: Snippet<[trackRef: TrackReferenceOrPlaceholder]>;
	}

	let { trackReferences, class: className = '', children: _children }: Props = $props();
</script>

<div class="lk-carousel-layout {className}">
	<TrackLoop {trackReferences}>
		{#snippet children(trackRef)}
			{@render children?.(trackRef)}
		{/snippet}
	</TrackLoop>
</div>

<style>
	.lk-carousel-layout {
		display: flex;
		gap: 8px;
		overflow-x: auto;
		scroll-snap-type: x mandatory;
		padding: 8px;
	}

	:global(.lk-carousel-layout > *) {
		flex: 0 0 auto;
		scroll-snap-align: start;
	}
</style>
