import { connectedParticipantsObserver } from '@livekit/components-core';
import { RoomEvent, type RemoteParticipant, type Room } from 'livekit-client';
import { useObservableState } from './internal/observable-state.svelte.js';
import { ensureRoom } from '../context/room-context.svelte.js';

export interface UseRemoteParticipantsOptions {
	additionalRoomEvents?: RoomEvent[];
}

export function useRemoteParticipants(
	options?: UseRemoteParticipantsOptions,
	room?: Room
): RemoteParticipant[] {
	const r = ensureRoom(room);
	const observable = connectedParticipantsObserver(r, {
		additionalRoomEvents: options?.additionalRoomEvents
	});
	return useObservableState(observable, Array.from(r.remoteParticipants.values()));
}
