import { participantPermissionObserver } from '@livekit/components-core';
import type { ParticipantPermission } from '@livekit/protocol';
import type { Participant } from 'livekit-client';
import { useObservableState } from './internal/observable-state.svelte.js';
import { ensureParticipant } from '../context/participant-context.svelte.js';

/**
 * The `useParticipantPermissions` hook returns the permissions of a given participant.
 *
 * @example
 * ```svelte
 * const permissions = useParticipantPermissions({ participant });
 * ```
 * @public
 */
export interface UseParticipantPermissionsOptions {
	participant?: Participant;
}

/** @public */
export function useParticipantPermissions(
	options: UseParticipantPermissionsOptions = {}
): ParticipantPermission | undefined {
	const p = ensureParticipant(options.participant);
	const permissionObserver = participantPermissionObserver(p);
	const permissions = useObservableState(permissionObserver, p.permissions);
	return permissions as ParticipantPermission | undefined;
}
