import { observeParticipantMedia, type ParticipantMedia } from '@livekit/components-core';
import type { LocalParticipant, Room, TrackPublication } from 'livekit-client';
import { useObservableState } from './internal/observable-state.svelte.js';
import { ensureRoom } from '../context/room-context.svelte.js';

export interface UseLocalParticipantOptions {
	room?: Room;
}

export interface UseLocalParticipantReturn {
	isMicrophoneEnabled: boolean;
	isScreenShareEnabled: boolean;
	isCameraEnabled: boolean;
	microphoneTrack: TrackPublication | undefined;
	cameraTrack: TrackPublication | undefined;
	lastMicrophoneError: Error | undefined;
	lastCameraError: Error | undefined;
	localParticipant: LocalParticipant;
}

export function useLocalParticipant(
	options: UseLocalParticipantOptions = {}
): UseLocalParticipantReturn {
	const r = ensureRoom(options.room);
	const observable = observeParticipantMedia(r.localParticipant);
	const media = useObservableState<ParticipantMedia<LocalParticipant>>(observable, {
		isCameraEnabled: r.localParticipant.isCameraEnabled,
		isMicrophoneEnabled: r.localParticipant.isMicrophoneEnabled,
		isScreenShareEnabled: r.localParticipant.isScreenShareEnabled,
		participant: r.localParticipant,
		cameraTrack: undefined,
		microphoneTrack: undefined
	});

	return {
		get isMicrophoneEnabled() {
			return media.isMicrophoneEnabled;
		},
		get isScreenShareEnabled() {
			return media.isScreenShareEnabled;
		},
		get isCameraEnabled() {
			return media.isCameraEnabled;
		},
		get microphoneTrack() {
			return media.microphoneTrack;
		},
		get cameraTrack() {
			return media.cameraTrack;
		},
		get lastMicrophoneError() {
			return media.participant.lastMicrophoneError;
		},
		get lastCameraError() {
			return media.participant.lastCameraError;
		},
		get localParticipant() {
			return media.participant;
		}
	};
}
