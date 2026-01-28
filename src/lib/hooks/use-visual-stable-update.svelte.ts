import type { TrackReferenceOrPlaceholder } from '@livekit/components-core';
import { SvelteMap } from 'svelte/reactivity';

export interface UseVisualStableUpdateOptions {
	trackReferences: TrackReferenceOrPlaceholder[];
	maxItems: number;
}

function getTrackReferenceId(trackRef: TrackReferenceOrPlaceholder): string {
	return `${trackRef.participant.identity}-${trackRef.source}`;
}

export function useVisualStableUpdate(
	options: UseVisualStableUpdateOptions
): TrackReferenceOrPlaceholder[] {
	const stableIds: string[] = [];

	$effect(() => {
		const currentIds = options.trackReferences.map(getTrackReferenceId);

		// Remove IDs that are no longer present
		for (let i = stableIds.length - 1; i >= 0; i--) {
			if (!currentIds.includes(stableIds[i])) {
				stableIds.splice(i, 1);
			}
		}

		// Add new IDs
		for (const id of currentIds) {
			if (!stableIds.includes(id)) {
				stableIds.push(id);
			}
		}

		// Limit to max items
		while (stableIds.length > options.maxItems) {
			stableIds.pop();
		}
	});

	return $derived.by(() => {
		const result: TrackReferenceOrPlaceholder[] = [];
		const trackRefMap = new SvelteMap(
			options.trackReferences.map((tr) => [getTrackReferenceId(tr), tr])
		);

		for (const id of stableIds) {
			const trackRef = trackRefMap.get(id);
			if (trackRef) {
				result.push(trackRef);
			}
		}

		return result;
	});
}
