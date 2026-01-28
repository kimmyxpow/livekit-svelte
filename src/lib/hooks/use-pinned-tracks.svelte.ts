import type { PinState, TrackReferenceOrPlaceholder } from '@livekit/components-core';
import type { Writable } from 'svelte/store';
import { getPinContext } from '../context/pin-context.svelte.js';

export function usePinnedTracks(): Writable<PinState> | undefined {
	const ctx = getPinContext();
	return ctx?.pinState;
}

export function useIsTrackPinned(trackRef: TrackReferenceOrPlaceholder): boolean {
	const ctx = getPinContext();
	if (!ctx) return false;

	let isPinned = $state(false);

	ctx.pinState.subscribe((state) => {
		isPinned = state.some(
			(pinned) =>
				pinned.participant.identity === trackRef.participant.identity &&
				pinned.source === trackRef.source
		);
	});

	return isPinned;
}
