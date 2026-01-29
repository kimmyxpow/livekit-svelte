<script lang="ts">
	import type { TrackReferenceOrPlaceholder } from '@livekit/components-core';
	import type { Participant } from 'livekit-client';
	import type { Snippet } from 'svelte';
	import { Track } from 'livekit-client';
	import { ensureTrackRef } from '../../context/track-ref-context.svelte.js';
	import { ensureParticipant } from '../../context/participant-context.svelte.js';
	import { isTrackReference } from '@livekit/components-core';
	import VideoTrack from './video-track.svelte';
	import AudioTrack from './audio-track.svelte';
	import ParticipantName from './participant-name.svelte';
	import ConnectionQualityIndicator from './connection-quality-indicator.svelte';
	import TrackMutedIndicator from './track-muted-indicator.svelte';
	import { ParticipantPlaceholder } from '../../assets/images/index.js';
	import { LockLockedIcon, ScreenShareIcon } from '../../assets/icons/index.js';
	import FocusToggle from '../controls/focus-toggle.svelte';
	import { useIsEncrypted } from '../../hooks/use-is-encrypted.svelte.js';

	interface Props {
		trackRef?: TrackReferenceOrPlaceholder;
		participant?: Participant;
		disableSpeakingIndicator?: boolean;
		class?: string;
		children?: Snippet;
	}

	let {
		trackRef,
		participant,
		disableSpeakingIndicator: _disableSpeakingIndicator,
		class: className = '',
		children
	}: Props = $props();

	const tr = $derived(trackRef ? ensureTrackRef(trackRef) : undefined);
	const p = $derived(participant ? ensureParticipant(participant) : tr?.participant);

	const isVideoTrack = $derived(
		tr?.source === Track.Source.Camera || tr?.source === Track.Source.ScreenShare
	);
	const isAudioTrack = $derived(
		tr?.source === Track.Source.Microphone || tr?.source === Track.Source.ScreenShareAudio
	);

	const isEncrypted = $derived(p ? useIsEncrypted(p) : false);
	const isTrackRef = $derived(isTrackReference(tr));
</script>

<div class="lk-participant-tile {className}">
	{#if tr && isTrackRef}
		{#if isVideoTrack}
			<VideoTrack trackRef={tr} />
		{:else if isAudioTrack}
			<AudioTrack trackRef={tr} />
		{/if}
	{/if}

	{#if !children}
		<div class="lk-participant-placeholder">
			<ParticipantPlaceholder />
		</div>

		<div class="lk-participant-metadata">
			<div class="lk-participant-metadata-item">
				{#if tr && tr.source === Track.Source.Camera}
					{#if isEncrypted}
						<LockLockedIcon style="margin-right: 0.25rem" />
					{/if}
					<TrackMutedIndicator
						trackRef={{ participant: tr.participant, source: Track.Source.Microphone }}
						show="muted"
					/>
					<ParticipantName participant={p} />
				{:else if tr && tr.source === Track.Source.ScreenShare}
					<ScreenShareIcon style="margin-right: 0.25rem" />
					<ParticipantName participant={p}>'s screen</ParticipantName>
				{/if}
			</div>
			<ConnectionQualityIndicator class="lk-participant-metadata-item" />
		</div>
	{:else}
		{@render children()}
	{/if}

	{#if tr}
		<FocusToggle trackRef={tr} />
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
