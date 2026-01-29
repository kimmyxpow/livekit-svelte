import { participantPermissionObserver } from '@livekit/components-core';
import type { ParticipantPermission } from '@livekit/protocol';
import { useObservableState } from './internal/observable-state.svelte.js';
import { getRoomContext } from '../context/room-context.svelte.js';

/**
 * The `useLocalParticipantPermissions` hook returns the local participant's permissions.
 *
 * @example
 * ```svelte
 * const { canPublish, canPublishData } = useLocalParticipantPermissions();
 * ```
 * @public
 */
export function useLocalParticipantPermissions(): ParticipantPermission | undefined {
	const room = getRoomContext();
	const permissionObserver = participantPermissionObserver(room.localParticipant);
	const permissions = useObservableState(permissionObserver, room.localParticipant.permissions);
	return permissions;
}
