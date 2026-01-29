import type { TrackSource } from '@livekit/components-core';
import { getTrackByIdentifier, setupMediaTrack } from '@livekit/components-core';
import { Track } from 'livekit-client';
import { useObservableState } from './internal/observable-state.svelte.js';

/**
 * @internal
 */
export function useTrackRefBySourceOrName(source: TrackSource<Track.Source>) {
	const initialPublication = getTrackByIdentifier(source);

	const { trackObserver } = setupMediaTrack(source);

	const publication = useObservableState(trackObserver, initialPublication);

	return {
		participant: source.participant,
		source: source.source ?? Track.Source.Unknown,
		publication
	};
}
