import { getContext, setContext } from 'svelte';
import type { Participant, LocalParticipant, RemoteParticipant } from 'livekit-client';
import { PARTICIPANT_CONTEXT_KEY } from './keys.js';

export function setParticipantContext(participant: Participant): void {
	setContext(PARTICIPANT_CONTEXT_KEY, participant);
}

export function getParticipantContext(): Participant | undefined {
	return getContext<Participant>(PARTICIPANT_CONTEXT_KEY);
}

export function ensureParticipant(participant?: Participant): Participant {
	const p = participant ?? getParticipantContext();
	if (!p) {
		throw new Error(
			'No participant context found. Make sure the component is inside a ParticipantLoop or ParticipantTile component.'
		);
	}
	return p;
}

export function isLocalParticipant(p: Participant): p is LocalParticipant {
	return p.isLocal;
}

export function isRemoteParticipant(p: Participant): p is RemoteParticipant {
	return !p.isLocal;
}
