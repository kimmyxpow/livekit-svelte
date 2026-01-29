import {
	type ReceivedTranscriptionSegment,
	addMediaTimestampToTranscription as addTimestampsToTranscription,
	dedupeSegments,
	trackTranscriptionObserver,
	type TrackReferenceOrPlaceholder
} from '@livekit/components-core';
import type { TranscriptionSegment } from 'livekit-client';
import { useTrackSyncTime } from './use-track-sync-time.svelte.js';

/**
 * @alpha
 * @deprecated Use useTranscription instead
 */
export interface TrackTranscriptionOptions {
	/**
	 * how many transcription segments should be buffered in state
	 * @defaultValue 100
	 */
	bufferSize?: number;
	/**
	 * optional callback for retrieving newly incoming transcriptions only
	 */
	onTranscription?: (newSegments: TranscriptionSegment[]) => void;
}

const TRACK_TRANSCRIPTION_DEFAULTS = {
	bufferSize: 100
} as const satisfies TrackTranscriptionOptions;

/**
 * @returns An object consisting of `segments` with maximum length of opts.bufferSize
 * @alpha
 * @deprecated Use useTranscription instead
 */
export function useTrackTranscription(
	trackRef: TrackReferenceOrPlaceholder | undefined,
	options?: TrackTranscriptionOptions
) {
	const opts = { ...TRACK_TRANSCRIPTION_DEFAULTS, ...options };

	let segments = $state<Array<ReceivedTranscriptionSegment>>([]);

	const syncTimestamps = useTrackSyncTime(trackRef);

	const handleSegmentMessage = (newSegments: TranscriptionSegment[]) => {
		opts.onTranscription?.(newSegments);
		segments = dedupeSegments(
			segments,
			// when first receiving a segment, add the current media timestamp to it
			newSegments.map((s) => addTimestampsToTranscription(s, { timestamp: syncTimestamps })),
			opts.bufferSize
		);
	};

	$effect(() => {
		if (!trackRef?.publication) {
			return;
		}
		const subscription = trackTranscriptionObserver(trackRef.publication).subscribe((evt) => {
			handleSegmentMessage(...evt);
		});
		return () => {
			subscription.unsubscribe();
		};
	});

	return { segments };
}
