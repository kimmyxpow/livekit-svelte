import { participantInfoObserver } from '@livekit/components-core';
import type { Participant } from 'livekit-client';
import { useObservableState } from './internal/observable-state.svelte.js';
import { ensureParticipant } from '../context/participant-context.svelte.js';

export interface ParticipantInfo {
	name: string | undefined;
	identity: string;
	metadata: string | undefined;
}

export function useParticipantInfo(
	participant?: Participant | (() => Participant | undefined)
): ParticipantInfo {
	const p = $derived(
		ensureParticipant(typeof participant === 'function' ? participant() : participant)
	);
	const observable = $derived(participantInfoObserver(p));
	const initialInfo = $derived({
		name: p.name,
		identity: p.identity,
		metadata: p.metadata
	});
	return useObservableState(observable, initialInfo);
}
