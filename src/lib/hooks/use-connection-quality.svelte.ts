import { createConnectionQualityObserver } from '@livekit/components-core';
import type { ConnectionQuality, Participant } from 'livekit-client';
import { useObservableState } from './internal/observable-state.svelte.js';
import { ensureParticipant } from '../context/participant-context.svelte.js';

export function useConnectionQuality(
	participant?: Participant | (() => Participant | undefined)
): ConnectionQuality {
	const p = $derived(
		ensureParticipant(typeof participant === 'function' ? participant() : participant)
	);
	const observable = $derived(createConnectionQualityObserver(p));
	return useObservableState(observable, p.connectionQuality);
}
