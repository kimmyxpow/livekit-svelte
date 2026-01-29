import type { ParticipantClickEvent, TrackReferenceOrPlaceholder } from '@livekit/components-core';
import { setupParticipantTile } from '@livekit/components-core';
import { ensureTrackRef } from '../context/track-ref-context.svelte.js';
import { mergeProps } from '../utils.js';
import { useFacingMode } from './use-facing-mode.svelte.js';
import { useIsMuted } from './use-is-muted.svelte.js';
import { useIsSpeaking } from './use-is-speaking.svelte.js';
import { Track } from 'livekit-client';

/** @public */
export interface UseParticipantTileProps<_T extends HTMLElement> {
	/** The track reference to display. */
	trackRef?: TrackReferenceOrPlaceholder;
	disableSpeakingIndicator?: boolean;
	onParticipantClick?: (event: ParticipantClickEvent) => void;
	htmlProps: Record<string, unknown>;
}

/**
 * The `useParticipantTile` hook is used to implement the `ParticipantTile` and returns the props needed to render the tile.
 * @remarks
 * The returned props include many data attributes that are useful for CSS styling purposes because they
 * indicate the state of the participant and the track.
 * For example: `data-lk-audio-muted`, `data-lk-video-muted`, `data-lk-speaking`, `data-lk-local-participant`, `data-lk-source`, `data-lk-facing-mode`.
 * @public
 */
export function useParticipantTile<T extends HTMLElement>({
	trackRef,
	onParticipantClick,
	disableSpeakingIndicator,
	htmlProps
}: UseParticipantTileProps<T>) {
	const trackReference = ensureTrackRef(trackRef);

	const { className } = setupParticipantTile();

	const mergedProps = mergeProps(htmlProps, {
		className,
		onclick: (event: MouseEvent) => {
			if (typeof htmlProps.onclick === 'function') {
				(htmlProps.onclick as (e: MouseEvent) => void)(event);
			}
			if (typeof onParticipantClick === 'function') {
				const track =
					trackReference.publication ??
					trackReference.participant.getTrackPublication(trackReference.source);
				onParticipantClick({ participant: trackReference.participant, track });
			}
		}
	});

	const micTrack = trackReference.participant.getTrackPublication(Track.Source.Microphone);
	const micRef = {
		participant: trackReference.participant,
		source: Track.Source.Microphone,
		publication: micTrack
	};
	const isVideoMuted = useIsMuted(trackReference);
	const isAudioMuted = useIsMuted(micRef);
	const isSpeaking = useIsSpeaking(trackReference.participant);
	const facingMode = useFacingMode(trackReference);

	return {
		elementProps: {
			'data-lk-audio-muted': isAudioMuted,
			'data-lk-video-muted': isVideoMuted,
			'data-lk-speaking': disableSpeakingIndicator === true ? false : isSpeaking,
			'data-lk-local-participant': trackReference.participant.isLocal,
			'data-lk-source': trackReference.source,
			'data-lk-facing-mode': facingMode,
			...mergedProps
		} as Record<string, unknown>
	};
}
