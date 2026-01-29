<script lang="ts">
	import type { TrackReferenceOrPlaceholder } from '@livekit/components-core';
	import { useGridLayout } from '../../hooks/use-grid-layout.svelte.js';
	import TrackLoop from '../track-loop.svelte';
	import { useElementSize } from '../../hooks/internal/resize-observer.svelte.js';

	interface Props {
		trackReferences: TrackReferenceOrPlaceholder[];
		class?: string;
	}

	let { trackReferences, class: className = '' }: Props = $props();

	let containerElement: HTMLDivElement | undefined = $state(undefined);
	const size = useElementSize(() => containerElement);

	const layout = $derived(
		size.width > 0 && size.height > 0
			? useGridLayout({
					participantCount: trackReferences.length,
					width: size.width,
					height: size.height
				})
			: { columns: 1, rows: 1, maxTiles: 1, minWidth: 0, minHeight: 0, name: '1x1' }
	);
</script>

<div
	bind:this={containerElement}
	class="lk-grid-layout {className}"
	style:--lk-grid-columns={layout.columns}
	style:--lk-grid-rows={layout.rows}
>
	<TrackLoop {trackReferences}>
		{#snippet children(trackRef)}
			{@render children?.(trackRef)}
		{/snippet}
	</TrackLoop>
</div>

<style>
	.lk-grid-layout {
		display: grid;
		grid-template-columns: repeat(var(--lk-grid-columns, 1), 1fr);
		grid-template-rows: repeat(var(--lk-grid-rows, 1), 1fr);
		gap: 8px;
		width: 100%;
		height: 100%;
	}
</style>
