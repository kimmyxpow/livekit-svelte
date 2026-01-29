import type { TrackReference } from '@livekit/components-core';
import { participantTracksObservable } from '@livekit/components-core';
import { useObservableState } from './internal/observable-state.svelte.js';
import type { Room, Track } from 'livekit-client';
import { getParticipantContext } from '../context/participant-context.svelte.js';
import { useParticipants } from './use-participants.svelte.js';

export type UseParticipantTracksOptions = {
	participantIdentity?: string;
	room?: Room;
};

/**
 * `useParticipantTracks` is a custom hook that allows you to get tracks of a specific participant only, by specifying the participant's identity.
 * If the participant identity is not passed the hook will try to get the participant from a participant context.
 * @public
 */
export function useParticipantTracks<TrackSource extends Track.Source>(
	sources: Array<TrackSource>,
	optionsOrParticipantIdentity:
		| UseParticipantTracksOptions
		| UseParticipantTracksOptions['participantIdentity'] = {}
): Array<TrackReference> {
	let participantIdentity: UseParticipantTracksOptions['participantIdentity'];
	let room: UseParticipantTracksOptions['room'];
	if (typeof optionsOrParticipantIdentity === 'string') {
		participantIdentity = optionsOrParticipantIdentity;
	} else {
		participantIdentity = optionsOrParticipantIdentity?.participantIdentity;
		room = optionsOrParticipantIdentity?.room;
	}

	const participantContext = getParticipantContext();
	const participants = useParticipants(undefined, room);

	const p = participantIdentity
		? participants.find((p) => p.identity === participantIdentity)
		: participantContext;

	const observable = p ? participantTracksObservable(p, { sources }) : undefined;

	const trackRefs = useObservableState(observable, [] as Array<TrackReference>);

	return trackRefs;
}
