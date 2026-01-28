import { activeSpeakerObserver } from '@livekit/components-core';
import type { Participant, Room } from 'livekit-client';
import { useObservableState } from './internal/observable-state.svelte.js';
import { ensureRoom } from '../context/room-context.svelte.js';

export function useSpeakingParticipants(room?: Room): Participant[] {
	const r = ensureRoom(room);
	const observable = activeSpeakerObserver(r);
	return useObservableState(observable, []);
}
