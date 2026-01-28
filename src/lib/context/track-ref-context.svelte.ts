import { getContext, setContext } from 'svelte';
import type { TrackReference, TrackReferenceOrPlaceholder } from '@livekit/components-core';
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

export function isTrackReference(
	trackRef: TrackReferenceOrPlaceholder
): trackRef is TrackReference {
	return 'publication' in trackRef && trackRef.publication !== undefined;
}
