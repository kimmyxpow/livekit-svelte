import { DataTopic, ParticipantAgentAttributes } from '@livekit/components-core';
import type { Room } from 'livekit-client';
import { useTextStream } from './use-text-stream.svelte.js';

/**
 * @beta
 */
export interface UseTranscriptionsOptions {
	room?: Room;
	participantIdentities?: string[];
	trackSids?: string[];
}

/**
 * @beta
 * useTranscriptions is a hook that returns the transcriptions for the given participant identities and track sids,
 * if no options are provided, it will return all transcriptions
 * @example
 * ```svelte
 * const transcriptions = useTranscriptions();
 * ```
 */
export function useTranscriptions(opts?: UseTranscriptionsOptions) {
	const { participantIdentities, trackSids } = opts ?? {};
	const { textStreams } = useTextStream(DataTopic.TRANSCRIPTION, { room: opts?.room });

	const filteredMessages = $derived(
		textStreams
			.filter((stream) =>
				participantIdentities
					? participantIdentities.includes(stream.participantInfo.identity)
					: true
			)
			.filter((stream) =>
				trackSids
					? trackSids.includes(
							stream.streamInfo.attributes?.[ParticipantAgentAttributes.TranscribedTrackId] ?? ''
						)
					: true
			)
	);

	return filteredMessages;
}
