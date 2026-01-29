import { mutedObserver, type TrackReferenceOrPlaceholder } from '@livekit/components-core';
import type { Participant, Track } from 'livekit-client';
import { ensureParticipant } from '../context/participant-context.svelte.js';
import { useObservableState } from './internal/observable-state.svelte.js';

/** @public */
export interface UseIsMutedOptions {
	participant?: Participant;
}

/**
 * The `useIsMuted` hook is used to implement the `TrackMutedIndicator` or your custom implementation of it.
 * It returns a `boolean` that indicates if the track is muted or not.
 *
 * @example With a track reference
 * ```svelte
 * const isMuted = useIsMuted(track);
 * ```
 *
 * @example With a track source / participant
 * ```svelte
 * const isMuted = useIsMuted('camera', { participant });
 * ```
 *
 * @param sourceOrTrackRef - Either a `TrackReference` or a `Track.Source` (see usage examples)
 * @param options - Additional options when using a `Track.Source`
 * @returns boolean indicating if the track is muted
 *
 * @public
 */
export function useIsMuted(trackRef: TrackReferenceOrPlaceholder): boolean;
export function useIsMuted(
	sourceOrTrackRef: TrackReferenceOrPlaceholder | Track.Source,
	options?: UseIsMutedOptions
): boolean;
export function useIsMuted(
	sourceOrTrackRef: TrackReferenceOrPlaceholder | Track.Source,
	options: UseIsMutedOptions = {}
): boolean {
	const passedParticipant =
		typeof sourceOrTrackRef === 'string' ? options.participant : sourceOrTrackRef.participant;
	const p = ensureParticipant(passedParticipant);
	const ref =
		typeof sourceOrTrackRef === 'string'
			? { participant: p, source: sourceOrTrackRef }
			: sourceOrTrackRef;

	const initialMuted = !!(ref.publication?.isMuted || p.getTrackPublication(ref.source)?.isMuted);

	const observable = mutedObserver(ref);
	const isMuted = useObservableState(observable, initialMuted);

	return isMuted;
}
