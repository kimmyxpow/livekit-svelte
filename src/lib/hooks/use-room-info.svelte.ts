import { roomInfoObserver } from '@livekit/components-core';
import type { Room } from 'livekit-client';
import { useObservableState } from './internal/observable-state.svelte.js';
import { ensureRoom } from '../context/room-context.svelte.js';

export interface RoomInfo {
	name: string;
	metadata: string | undefined;
}

export function useRoomInfo(room?: Room | (() => Room | undefined)): RoomInfo {
	const r = $derived(ensureRoom(typeof room === 'function' ? room() : room));
	const observable = $derived(roomInfoObserver(r));
	const initialInfo = $derived({
		name: r.name,
		metadata: r.metadata
	});
	return useObservableState(observable, initialInfo);
}
