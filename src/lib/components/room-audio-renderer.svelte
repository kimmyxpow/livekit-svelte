<script lang="ts" module>
	import type { Room } from 'livekit-client';

	export interface RoomAudioRendererProps {
		room?: Room;
		volume?: number;
		muted?: boolean;
	}
</script>

<script lang="ts">
	import { Track } from 'livekit-client';
	import { useTracks } from '../hooks/use-tracks.svelte.js';
	import AudioTrack from './participant/audio-track.svelte';

	let { room: roomProp, volume, muted = false }: RoomAudioRendererProps = $props();

	const trackReferences = useTracks([Track.Source.Microphone, Track.Source.ScreenShareAudio], {
		get room() {
			return roomProp;
		}
	});
</script>

{#each trackReferences as trackRef (`${trackRef.participant.identity}-${trackRef.source}`)}
	<AudioTrack {trackRef} {volume} {muted} />
{/each}
