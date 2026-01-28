import { observeParticipantMedia, type ParticipantMedia } from '@livekit/components-core';
import type { LocalParticipant, Room } from 'livekit-client';
import { useObservableState } from './internal/observable-state.svelte.js';
import { ensureRoom } from '../context/room-context.svelte.js';

export function useLocalParticipant(room?: Room): ParticipantMedia<LocalParticipant> {
	const r = ensureRoom(room);
	const observable = observeParticipantMedia(r.localParticipant);
	return useObservableState(observable, {
		isCameraEnabled: r.localParticipant.isMicrophoneEnabled,
		isMicrophoneEnabled: r.localParticipant.isMicrophoneEnabled,
		isScreenShareEnabled: r.localParticipant.isScreenShareEnabled,
		participant: r.localParticipant
	});
}
