import { createIsSpeakingObserver } from '@livekit/components-core';
import type { Participant } from 'livekit-client';
import { useObservableState } from './internal/observable-state.svelte.js';
import { ensureParticipant } from '../context/participant-context.svelte.js';

export function useIsSpeaking(participant?: Participant): boolean {
	const p = ensureParticipant(participant);
	const observable = createIsSpeakingObserver(p);
	return useObservableState(observable, p.isSpeaking);
}
