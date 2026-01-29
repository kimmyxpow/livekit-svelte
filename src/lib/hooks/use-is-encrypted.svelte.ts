import { encryptionStatusObservable } from '@livekit/components-core';
import { LocalParticipant, type Participant, type Room } from 'livekit-client';
import { useObservableState } from './internal/observable-state.svelte.js';
import { ensureParticipant } from '../context/participant-context.svelte.js';
import { ensureRoom } from '../context/room-context.svelte.js';

/**
 * @alpha
 */
export interface UseIsEncryptedOptions {
	room?: Room;
}

/**
 * @alpha
 */
export function useIsEncrypted(participant?: Participant, options: UseIsEncryptedOptions = {}) {
	const p = ensureParticipant(participant);
	const room = ensureRoom(options.room);

	const observer = encryptionStatusObservable(room, p);
	const initialValue = p.isLocal ? (p as LocalParticipant).isE2EEEnabled : !!p?.isEncrypted;
	const isEncrypted = useObservableState(observer, initialValue);

	return isEncrypted;
}
