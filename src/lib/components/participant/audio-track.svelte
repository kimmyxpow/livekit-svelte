<script lang="ts">
	import type { TrackReferenceOrPlaceholder } from '@livekit/components-core';
	import { ensureTrackRef } from '../../context/track-ref-context.svelte.js';

	interface Props {
		trackRef?: TrackReferenceOrPlaceholder;
		class?: string;
		style?: string;
		muted?: boolean;
	}

	let {
		trackRef: trackRefProp,
		class: className = '',
		style = '',
		muted = false
	}: Props = $props();

	let tr = $derived(ensureTrackRef(trackRefProp));
	let audioElement: HTMLAudioElement | undefined = $state(undefined);

	$effect(() => {
		if (audioElement && tr.publication?.track?.attach) {
			tr.publication.track.attach(audioElement);
			return () => {
				tr.publication?.track?.detach(audioElement!);
			};
		}
	});
</script>

{#if tr.publication?.track}
	<audio bind:this={audioElement} class={className} {style} autoplay {muted}></audio>
{/if}
