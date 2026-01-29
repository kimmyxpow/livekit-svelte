import { ConnectionState, Room } from 'livekit-client';
import { setupTextStream, type TextStreamData } from '@livekit/components-core';
import { ensureRoom } from '../context/room-context.svelte.js';
import { useConnectionState } from './use-connection-state.svelte.js';
import { useObservableState } from './internal/observable-state.svelte.js';

/** @beta */
export type UseTextStreamOptions = {
	room?: Room;
};

/**
 * @beta
 * @param topic - the topic to listen to
 * @returns an array of TextStreamData that holds the text, participantInfo, and streamInfo
 * @example
 * ```svelte
 * const { textStreams } = useTextStream('my-topic');
 * ```
 */
export function useTextStream(topic: string, options?: UseTextStreamOptions) {
	const room = ensureRoom(options?.room);

	const connectionState = useConnectionState(room);
	const isDisconnected = connectionState === ConnectionState.Disconnected;

	const textStreamData = setupTextStream(room, topic);
	const textStreamObservable = isDisconnected ? undefined : textStreamData;

	const textStreams = useObservableState<TextStreamData[]>(textStreamObservable, []);

	return { textStreams };
}
