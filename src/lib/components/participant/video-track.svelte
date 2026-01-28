<script lang="ts">
	import type { TrackReferenceOrPlaceholder } from '@livekit/components-core';
	import { Track } from 'livekit-client';
	import { ensureTrackRef } from '../../context/track-ref-context.svelte.js';

	interface Props {
		trackRef?: TrackReferenceOrPlaceholder;
		class?: string;
		style?: string;
		placeholder?: import('svelte').Snippet;
	}

	let { trackRef: trackRefProp, class: className = '', style = '', placeholder }: Props = $props();

	let tr = $derived(ensureTrackRef(trackRefProp));
	let videoElement: HTMLVideoElement | undefined = $state(undefined);

	$effect(() => {
		if (videoElement && tr.publication?.track?.attach) {
			tr.publication.track.attach(videoElement);
			return () => {
				tr.publication?.track?.detach(videoElement!);
			};
		}
	});
</script>

{#if tr.publication?.track}
	<video
		bind:this={videoElement}
		class={className}
		{style}
		autoplay
		playsinline
		muted={tr.publication.track.kind === Track.Kind.Audio}
	></video>
{:else}
	<div class={className} {style}>
		{#if placeholder}
			{@render placeholder()}
		{:else}
			<div class="lk-video-placeholder">No video</div>
		{/if}
	</div>
{/if}

<style>
	.lk-video-placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		background: #333;
		color: #fff;
	}

	video {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
</style>
