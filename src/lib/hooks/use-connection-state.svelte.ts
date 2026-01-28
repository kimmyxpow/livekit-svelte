import { connectionStateObserver } from '@livekit/components-core';
import type { ConnectionState, Room } from 'livekit-client';
import { useObservableState } from './internal/observable-state.svelte.js';
import { ensureRoom } from '../context/room-context.svelte.js';

export function useConnectionState(room?: Room | (() => Room | undefined)): ConnectionState {
	const r = $derived(ensureRoom(typeof room === 'function' ? room() : room));
	const observable = $derived(connectionStateObserver(r));
	return useObservableState(observable, r.state);
}
