<script lang="ts">
	import type { TrackReferenceOrPlaceholder } from '@livekit/components-core';
	import type { Participant } from 'livekit-client';
	import type { Snippet } from 'svelte';
	import { Track } from 'livekit-client';
	import { ensureTrackRef } from '../../context/track-ref-context.svelte.js';
	import { ensureParticipant } from '../../context/participant-context.svelte.js';
	import VideoTrack from './video-track.svelte';
	import AudioTrack from './audio-track.svelte';
	import ParticipantName from '../participant-name.svelte';
	import ConnectionQualityIndicator from '../connection-quality-indicator.svelte';
	import TrackMutedIndicator from './track-muted-indicator.svelte';

	interface Props {
		trackRef?: TrackReferenceOrPlaceholder;
		participant?: Participant;
		class?: string;
		children?: Snippet;
	}

	let { trackRef, participant, class: className = '', children }: Props = $props();

	const tr = $derived(trackRef ? ensureTrackRef(trackRef) : undefined);
	const p = $derived(participant ? ensureParticipant(participant) : tr?.participant);

	const isVideoTrack = $derived(
		tr?.source === Track.Source.Camera || tr?.source === Track.Source.ScreenShare
	);
	const isAudioTrack = $derived(
		tr?.source === Track.Source.Microphone || tr?.source === Track.Source.ScreenShareAudio
	);
</script>

<div class="lk-participant-tile {className}">
	{#if tr}
		{#if isVideoTrack}
			<VideoTrack trackRef={tr} />
		{/if}
		{#if isAudioTrack}
			<AudioTrack trackRef={tr} />
		{/if}
	{/if}

	<div class="lk-participant-metadata">
		<div class="lk-participant-name-row">
			<TrackMutedIndicator trackRef={tr} source={Track.Source.Microphone} />
			{#if p}
				<ParticipantName participant={p} />
			{/if}
		</div>
		{#if p}
			<ConnectionQualityIndicator participant={p} />
		{/if}
	</div>

	{#if children}
		{@render children()}
	{/if}
</div>

<style>
	.lk-participant-tile {
		position: relative;
		width: 100%;
		height: 100%;
		background: #1a1a1a;
		border-radius: 8px;
		overflow: hidden;
	}

	.lk-participant-metadata {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 8px 12px;
		background: linear-gradient(transparent, rgba(0, 0, 0, 0.6));
		color: white;
	}

	.lk-participant-name-row {
		display: flex;
		align-items: center;
		gap: 8px;
	}
</style>
