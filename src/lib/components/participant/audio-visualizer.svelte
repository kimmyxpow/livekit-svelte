<script lang="ts">
	import type { TrackReference } from '@livekit/components-core';
	import { useMultibandTrackVolume } from '../../hooks/use-track-volume.svelte.js';
	import { useEnsureTrackRef } from '../../context/track-ref-context.svelte.js';

	interface Props {
		trackRef?: TrackReference;
		class?: string;
	}

	let { trackRef, class: className = '' }: Props = $props();

	const trackReference = $derived(useEnsureTrackRef(trackRef));
	const volumes = useMultibandTrackVolume(trackReference, { bands: 7, loPass: 300 });

	const svgWidth = 200;
	const svgHeight = 90;
	const barWidth = 6;
	const barSpacing = 4;
	const volMultiplier = 50;
	const barCount = 7;
</script>

<svg
	width="100%"
	height="100%"
	viewBox="0 0 {svgWidth} {svgHeight}"
	class="lk-audio-visualizer {className}"
>
	<rect x="0" y="0" width="100%" height="100%" />
	<g transform="translate({(svgWidth - barCount * (barWidth + barSpacing)) / 2}, 0)">
		{#each volumes as vol, idx (idx)}
			<rect
				x={idx * (barWidth + barSpacing)}
				y={svgHeight / 2 - (vol * volMultiplier) / 2}
				width={barWidth}
				height={vol * volMultiplier}
			/>
		{/each}
	</g>
</svg>

<style>
	.lk-audio-visualizer {
		display: block;
	}
</style>
