<script lang="ts">
	import { Track, RoomEvent, type Room } from 'livekit-client';
	import { isEqualTrackRef, isTrackReference, isWeb, log } from '@livekit/components-core';
	import type {
		MessageDecoder,
		MessageEncoder,
		TrackReferenceOrPlaceholder,
		WidgetState
	} from '@livekit/components-core';
	import { useTracks } from '../hooks/use-tracks.svelte.js';
	import { usePinnedTracks } from '../hooks/use-pinned-tracks.svelte.js';
	import { useWarnAboutMissingStyles } from '../hooks/use-warn-about-missing-styles.svelte.js';
	import LayoutContextProvider from '../components/layout/layout-context-provider.svelte';
	import GridLayout from '../components/layout/grid-layout.svelte';
	import CarouselLayout from '../components/layout/carousel-layout.svelte';
	import FocusLayout from '../components/layout/focus-layout.svelte';
	import FocusLayoutContainer from '../components/layout/focus-layout-container.svelte';
	import ParticipantTile from '../components/participant/participant-tile.svelte';
	import RoomAudioRenderer from '../components/room-audio-renderer.svelte';
	import ConnectionStateToast from '../components/connection-state-toast.svelte';
	import ControlBar from './control-bar.svelte';
	import Chat from './chat.svelte';
	import type { MessageFormatter } from '../components/chat-entry.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		room?: Room;
		class?: string;
		chatMessageFormatter?: MessageFormatter;
		chatMessageEncoder?: MessageEncoder;
		chatMessageDecoder?: MessageDecoder;
		SettingsComponent?: Snippet<[]>;
	}

	let {
		room,
		class: className = '',
		chatMessageFormatter,
		chatMessageEncoder,
		chatMessageDecoder,
		SettingsComponent
	}: Props = $props();

	useWarnAboutMissingStyles();

	const tracks = useTracks(
		[
			{ source: Track.Source.Camera, withPlaceholder: true },
			{ source: Track.Source.ScreenShare, withPlaceholder: false }
		],
		{
			get room() {
				return room;
			},
			updateOnlyOn: [RoomEvent.ActiveSpeakersChanged],
			onlySubscribed: false
		}
	);

	const pinnedTracks = usePinnedTracks();

	const screenShareTracks = $derived(
		tracks
			.filter(isTrackReference)
			.filter((track) => track.publication.source === Track.Source.ScreenShare)
	);

	const focusTrack = $derived($pinnedTracks?.[0]);
	const carouselTracks = $derived(tracks.filter((track) => !isEqualTrackRef(track, focusTrack)));

	let lastAutoFocusedScreenShareTrack = $state<TrackReferenceOrPlaceholder | null>(null);

	$effect(() => {
		if (
			screenShareTracks.some((track) => track.publication.isSubscribed) &&
			lastAutoFocusedScreenShareTrack === null
		) {
			log.debug('Auto set screen share focus:', { newScreenShareTrack: screenShareTracks[0] });
			lastAutoFocusedScreenShareTrack = screenShareTracks[0];
		} else if (
			lastAutoFocusedScreenShareTrack &&
			!screenShareTracks.some(
				(track) =>
					track.publication.trackSid === lastAutoFocusedScreenShareTrack?.publication?.trackSid
			)
		) {
			log.debug('Auto clearing screen share focus.');
			lastAutoFocusedScreenShareTrack = null;
		}
		if (focusTrack && !isTrackReference(focusTrack)) {
			const updatedFocusTrack = tracks.find(
				(tr) =>
					tr.participant.identity === focusTrack.participant.identity &&
					tr.source === focusTrack.source
			);
			if (updatedFocusTrack !== focusTrack && isTrackReference(updatedFocusTrack)) {
				lastAutoFocusedScreenShareTrack = updatedFocusTrack;
			}
		}
	});

	let widgetState = $state<WidgetState>({
		showChat: false,
		unreadMessages: 0,
		showSettings: false
	});

	function widgetUpdate(state: WidgetState) {
		log.debug('updating widget state', state);
		widgetState = state;
	}
</script>

{#if isWeb()}
	<LayoutContextProvider onWidgetChange={widgetUpdate}>
		<div class="lk-video-conference {className}">
			<div class="lk-video-conference-inner">
				{#if !focusTrack}
					<div class="lk-grid-layout-wrapper">
						<GridLayout trackReferences={tracks}>
							{#snippet children(trackRef)}
								<ParticipantTile {trackRef} />
							{/snippet}
						</GridLayout>
					</div>
				{:else}
					<div class="lk-focus-layout-wrapper">
						<FocusLayoutContainer>
							<CarouselLayout trackReferences={carouselTracks}>
								{#snippet children(trackRef)}
									<ParticipantTile {trackRef} />
								{/snippet}
							</CarouselLayout>
							<FocusLayout trackRef={focusTrack}>
								<ParticipantTile trackRef={focusTrack} />
							</FocusLayout>
						</FocusLayoutContainer>
					</div>
				{/if}
				<ControlBar {room} controls={{ chat: true, settings: !!SettingsComponent }} />
			</div>
			<Chat
				style="display: {widgetState.showChat ? 'grid' : 'none'}"
				messageFormatter={chatMessageFormatter}
				messageEncoder={chatMessageEncoder}
				messageDecoder={chatMessageDecoder}
			/>
			{#if SettingsComponent}
				<div
					class="lk-settings-menu-modal"
					style="display: {widgetState.showSettings ? 'block' : 'none'}"
				>
					{@render SettingsComponent()}
				</div>
			{/if}
		</div>
	</LayoutContextProvider>
{/if}

<RoomAudioRenderer {room} />
<ConnectionStateToast />

<style>
	.lk-video-conference {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100vh;
		background: var(--lk-bg, #000);
	}

	.lk-video-conference-inner {
		flex: 1;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.lk-grid-layout-wrapper {
		flex: 1;
		overflow: hidden;
	}

	.lk-focus-layout-wrapper {
		flex: 1;
		overflow: hidden;
	}

	.lk-settings-menu-modal {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: var(--lk-modal-bg, rgba(0, 0, 0, 0.8));
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}
</style>
