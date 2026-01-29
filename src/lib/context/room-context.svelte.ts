import { getContext, setContext } from 'svelte';
import type { Room } from 'livekit-client';
import { ROOM_CONTEXT_KEY } from './keys.js';

export function setRoomContext(room: Room): void {
	setContext(ROOM_CONTEXT_KEY, room);
}

export function getRoomContext(): Room | undefined {
	return getContext<Room>(ROOM_CONTEXT_KEY);
}

export function ensureRoom(room?: Room): Room {
	const r = room ?? getRoomContext();
	if (!r) {
		throw new Error(
			'No room context found. Make sure the component is inside a LiveKitRoom component.'
		);
	}
	return r;
}

export function useMaybeRoomContext(): Room | undefined {
	return getRoomContext();
}
