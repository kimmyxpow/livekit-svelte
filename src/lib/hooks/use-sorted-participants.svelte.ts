import { sortParticipants } from '@livekit/components-core';
import type { Participant } from 'livekit-client';
import { useSpeakingParticipants } from './use-speaking-participants.svelte.js';

/**
 * The `useSortedParticipants` hook returns the participants sorted by importance.
 * @public
 */
export function useSortedParticipants(participants: Array<Participant>): Participant[] {
	const activeSpeakers = useSpeakingParticipants();

	// Create a derived value that re-sorts when speakers change
	const sortedParticipants = $derived(sortParticipants(participants));

	// Force re-computation when active speakers change
	void activeSpeakers;

	return sortedParticipants;
}
