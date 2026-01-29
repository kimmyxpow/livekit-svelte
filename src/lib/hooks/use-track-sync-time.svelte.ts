import { trackSyncTimeObserver, type TrackReferenceOrPlaceholder } from '@livekit/components-core';
import { useObservableState } from './internal/observable-state.svelte.js';

/**
 * @internal
 * @deprecated this is an internal hook that's only used by deprecated APIs
 */
export function useTrackSyncTime(ref: TrackReferenceOrPlaceholder | undefined) {
	const observable = ref?.publication?.track
		? trackSyncTimeObserver(ref.publication.track)
		: undefined;
	return useObservableState(observable, {
		timestamp: Date.now(),
		rtpTimestamp: ref?.publication?.track?.rtpTimestamp
	});
}
