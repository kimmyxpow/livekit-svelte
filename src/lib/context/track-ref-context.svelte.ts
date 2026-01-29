import { getContext, setContext } from 'svelte';
import type { TrackReferenceOrPlaceholder } from '@livekit/components-core';
import { TRACK_REF_CONTEXT_KEY } from './keys.js';

export function setTrackRefContext(trackRef: TrackReferenceOrPlaceholder): void {
	setContext(TRACK_REF_CONTEXT_KEY, trackRef);
}

export function getTrackRefContext(): TrackReferenceOrPlaceholder | undefined {
	return getContext<TrackReferenceOrPlaceholder>(TRACK_REF_CONTEXT_KEY);
}

export function ensureTrackRef(
	trackRef?: TrackReferenceOrPlaceholder
): TrackReferenceOrPlaceholder {
	const tr = trackRef ?? getTrackRefContext();
	if (!tr) {
		throw new Error(
			'No track reference context found. Make sure the component is inside a TrackLoop or ParticipantTile component.'
		);
	}
	return tr;
}

// Re-export from @livekit/components-core for convenience
export { isTrackReference } from '@livekit/components-core';

export function useMaybeTrackRefContext(): TrackReferenceOrPlaceholder | undefined {
	return getTrackRefContext();
}

export function useEnsureTrackRef(
	trackRef?: TrackReferenceOrPlaceholder
): TrackReferenceOrPlaceholder {
	return ensureTrackRef(trackRef);
}
