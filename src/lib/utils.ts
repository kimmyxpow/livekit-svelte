import type { TrackReference, TrackReferenceOrPlaceholder } from '@livekit/components-core';

export function isTrackReference(
	trackRef: TrackReferenceOrPlaceholder
): trackRef is TrackReference {
	return 'publication' in trackRef && trackRef.publication !== undefined;
}

export function getTrackReferenceId(trackRef: TrackReferenceOrPlaceholder): string {
	return `${trackRef.participant.identity}-${trackRef.source}`;
}

export function sortTrackReferences(
	trackRefs: TrackReferenceOrPlaceholder[]
): TrackReferenceOrPlaceholder[] {
	return [...trackRefs].sort((a, b) => {
		// Screen share tracks come first
		if (a.source === 'screen_share' && b.source !== 'screen_share') return -1;
		if (b.source === 'screen_share' && a.source !== 'screen_share') return 1;

		// Local participant comes before remote
		if (a.participant.isLocal && !b.participant.isLocal) return -1;
		if (b.participant.isLocal && !a.participant.isLocal) return 1;

		// Sort by identity
		return a.participant.identity.localeCompare(b.participant.identity);
	});
}
