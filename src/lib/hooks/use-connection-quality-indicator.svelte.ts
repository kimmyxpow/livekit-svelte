import { setupConnectionQualityIndicator } from '@livekit/components-core';
import type { Participant } from 'livekit-client';
import { useObservableState } from './internal/observable-state.svelte.js';
import { ensureParticipant } from '../context/participant-context.svelte.js';

/** @public */
export interface ConnectionQualityIndicatorOptions {
	participant?: Participant;
}

/**
 * The `useConnectionQualityIndicator` hook provides props for the `ConnectionQualityIndicator` or your custom implementation of it component.
 * @example
 * ```svelte
 * const { quality } = useConnectionQualityIndicator();
 * // or
 * const { quality } = useConnectionQualityIndicator({ participant });
 * ```
 * @public
 */
export function useConnectionQualityIndicator(options: ConnectionQualityIndicatorOptions = {}) {
	const p = ensureParticipant(options.participant);

	const { className, connectionQualityObserver } = setupConnectionQualityIndicator(p);

	const quality = useObservableState(connectionQualityObserver, p.connectionQuality);

	return { className, quality };
}
