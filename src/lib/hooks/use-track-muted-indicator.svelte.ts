import { mutedObserver } from '@livekit/components-core';
import type { TrackReferenceOrPlaceholder } from '@livekit/components-core';
import { useObservableState } from './internal/observable-state.svelte.js';
import { ensureTrackRef } from '../context/track-ref-context.svelte.js';

export function useTrackMutedIndicator(
	trackRef?: TrackReferenceOrPlaceholder | (() => TrackReferenceOrPlaceholder | undefined)
): boolean {
	const tr = $derived(ensureTrackRef(typeof trackRef === 'function' ? trackRef() : trackRef));
	const observable = $derived(mutedObserver(tr));
	return useObservableState(observable, false);
}
