import { recordingStatusObservable } from '@livekit/components-core';
import type { Room } from 'livekit-client';
import { useObservableState } from './internal/observable-state.svelte.js';
import { ensureRoom } from '../context/room-context.svelte.js';

/**
 * The `useIsRecording` hook returns a `boolean` that indicates if the room is currently being recorded.
 * @example
 * ```svelte
 * const isRecording = useIsRecording();
 * ```
 * @public
 */
export function useIsRecording(room?: Room): boolean {
	const r = ensureRoom(room);

	const observable = recordingStatusObservable(r);
	const isRecording = useObservableState(observable, r.isRecording);

	return isRecording;
}
