<script lang="ts">
	import { Track, type Room } from 'livekit-client';
	import { useTracks } from '../hooks/use-tracks.svelte.js';
	import AudioTrack from './participant/audio-track.svelte';

	interface Props {
		room?: Room;
		muted?: boolean;
	}

	let { room: roomProp, muted = false }: Props = $props();

	const trackReferences = useTracks([Track.Source.Microphone, Track.Source.ScreenShareAudio], {
		get room() {
			return roomProp;
		}
	});
</script>

{#each trackReferences as trackRef (`${trackRef.participant.identity}-${trackRef.source}`)}
	<AudioTrack {trackRef} {muted} />
{/each}
