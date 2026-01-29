import {
	type ParticipantIdentifier,
	connectedParticipantObserver,
	participantByIdentifierObserver
} from '@livekit/components-core';
import type { ParticipantEvent, RemoteParticipant } from 'livekit-client';
import { useObservableState } from './internal/observable-state.svelte.js';
import { getRoomContext } from '../context/room-context.svelte.js';

/** @public */
export interface UseRemoteParticipantOptions {
	/**
	 * To optimize performance, you can use the `updateOnlyOn` property to decide on what `ParticipantEvents` the hook updates.
	 * By default it updates on all relevant ParticipantEvents to keep the returned participant up to date.
	 */
	updateOnlyOn?: ParticipantEvent[];
}

/**
 * The `useRemoteParticipant` hook returns the first RemoteParticipant by either identity and/or based on the participant kind.
 * @remarks
 * To optimize performance, you can use the `updateOnlyOn` property to decide on what `ParticipantEvents` the hook updates.
 *
 * @example
 * ```svelte
 * const participant = useRemoteParticipant({kind: ParticipantKind.Agent, identity: 'myAgent'});
 * ```
 * @public
 */
export function useRemoteParticipant(
	identifier: ParticipantIdentifier,
	options?: UseRemoteParticipantOptions
): RemoteParticipant | undefined;
/**
 * The `useRemoteParticipant` hook returns the first RemoteParticipant by either identity or based on the participant kind.
 * @remarks
 * To optimize performance, you can use the `updateOnlyOn` property to decide on what `ParticipantEvents` the hook updates.
 *
 * @example
 * ```svelte
 * const participant = useRemoteParticipant('Russ');
 * ```
 * @public
 */
export function useRemoteParticipant(
	identity: string,
	options?: UseRemoteParticipantOptions
): RemoteParticipant | undefined;
export function useRemoteParticipant(
	identityOrIdentifier: string | ParticipantIdentifier,
	options: UseRemoteParticipantOptions = {}
): RemoteParticipant | undefined {
	const room = getRoomContext();

	const observable =
		typeof identityOrIdentifier === 'string'
			? connectedParticipantObserver(room, identityOrIdentifier, {
					additionalEvents: options.updateOnlyOn
				})
			: participantByIdentifierObserver(room, identityOrIdentifier, {
					additionalEvents: options.updateOnlyOn
				});

	const initialValue =
		typeof identityOrIdentifier === 'string'
			? room.getParticipantByIdentity(identityOrIdentifier)
			: Array.from(room.remoteParticipants.values()).find((p) => {
					if (identityOrIdentifier.identity && p.identity !== identityOrIdentifier.identity) {
						return false;
					}
					if (identityOrIdentifier.kind && p.kind !== identityOrIdentifier.kind) {
						return false;
					}
					return true;
				});

	const participant = useObservableState(observable, initialValue);

	return participant;
}
