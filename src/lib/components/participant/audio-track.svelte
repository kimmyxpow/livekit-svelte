<script lang="ts" module>
	import type { TrackReferenceOrPlaceholder } from '@livekit/components-core';

	export interface AudioTrackProps {
		trackRef?: TrackReferenceOrPlaceholder;
		class?: string;
		style?: string;
		volume?: number;
		muted?: boolean;
	}
</script>

<script lang="ts">
	import { ensureTrackRef } from '../../context/track-ref-context.svelte.js';
	import { RemoteTrackPublication, RemoteAudioTrack } from 'livekit-client';
	import { log } from '@livekit/components-core';

	let {
		trackRef: trackRefProp,
		class: className = '',
		style = '',
		volume,
		muted = false
	}: AudioTrackProps = $props();

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

	$effect(() => {
		if (volume === undefined || tr.publication?.track === undefined) {
			return;
		}
		if (tr.publication.track instanceof RemoteAudioTrack) {
			tr.publication.track.setVolume(volume);
		} else {
			log.warn('Volume can only be set on remote audio tracks.');
		}
	});

	$effect(() => {
		if (muted === undefined || tr.publication === undefined) {
			return;
		}
		if (tr.publication instanceof RemoteTrackPublication) {
			tr.publication.setEnabled(!muted);
		} else {
			log.warn('Can only call setEnabled on remote track publications.');
		}
	});
</script>

{#if tr.publication?.track}
	<audio bind:this={audioElement} class={className} {style} autoplay {muted}></audio>
{/if}
