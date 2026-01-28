import { connectedParticipantsObserver } from '@livekit/components-core';
import { RoomEvent, type RemoteParticipant, type Room } from 'livekit-client';
import { useObservableState } from './internal/observable-state.svelte.js';
import { ensureRoom } from '../context/room-context.svelte.js';

export interface UseParticipantsOptions {
	additionalRoomEvents?: RoomEvent[];
}

export function useParticipants(
	options?: UseParticipantsOptions,
	room?: Room | (() => Room | undefined)
): RemoteParticipant[] {
	const r = $derived(ensureRoom(typeof room === 'function' ? room() : room));
	const observable = $derived(
		connectedParticipantsObserver(r, {
			additionalRoomEvents: options?.additionalRoomEvents
		})
	);
	const initialParticipants = $derived(Array.from(r.remoteParticipants.values()));
	return useObservableState(observable, initialParticipants);
}
