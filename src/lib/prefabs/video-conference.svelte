<script lang="ts">
	import { Track, type Room } from 'livekit-client';
	import { useTracks } from '../hooks/use-tracks.svelte.js';
	import { usePinnedTracks } from '../hooks/use-pinned-tracks.svelte.js';
	import LayoutContextProvider from '../components/layout/layout-context-provider.svelte';
	import GridLayout from '../components/layout/grid-layout.svelte';
	import FocusLayout from '../components/layout/focus-layout.svelte';
	import FocusLayoutContainer from '../components/layout/focus-layout-container.svelte';
	import ParticipantTile from '../components/participant/participant-tile.svelte';
	import RoomAudioRenderer from '../components/room-audio-renderer.svelte';
	import ControlBar from './control-bar.svelte';

	interface Props {
		room?: Room;
		class?: string;
	}

	let { room, class: className = '' }: Props = $props();

	const trackReferences = useTracks([Track.Source.Camera, Track.Source.ScreenShare], {
		get room() {
			return room;
		}
	});

	const pinnedTracks = usePinnedTracks();

	const hasPinnedTrack = $derived(pinnedTracks && $pinnedTracks && $pinnedTracks.length > 0);
</script>

<LayoutContextProvider>
	<div class="lk-video-conference {className}">
		<div class="lk-video-conference-main">
			{#if hasPinnedTrack && $pinnedTracks}
				<FocusLayoutContainer pinnedTrack={$pinnedTracks[0]}>
					<FocusLayout trackRef={$pinnedTracks[0]}>
						<ParticipantTile trackRef={$pinnedTracks[0]} />
					</FocusLayout>
					<GridLayout
						trackReferences={trackReferences.filter(
							(tr) =>
								!($pinnedTracks || []).some(
									(p) =>
										p.participant.identity === tr.participant.identity && p.source === tr.source
								)
						)}
					>
						{#snippet children(trackRef)}
							<ParticipantTile {trackRef} />
						{/snippet}
					</GridLayout>
				</FocusLayoutContainer>
			{:else}
				<GridLayout {trackReferences}>
					{#snippet children(trackRef)}
						<ParticipantTile {trackRef} />
					{/snippet}
				</GridLayout>
			{/if}
		</div>
		<RoomAudioRenderer {room} />
		<ControlBar {room} />
	</div>
</LayoutContextProvider>

<style>
	.lk-video-conference {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100vh;
		background: #000;
	}

	.lk-video-conference-main {
		flex: 1;
		overflow: hidden;
		padding: 8px;
	}
</style>
