import type { TrackIdentifier } from '@livekit/components-core';
import { getTrackByIdentifier, setupMediaTrack } from '@livekit/components-core';
import type { TrackPublication } from 'livekit-client';
import { useObservableState } from './internal/observable-state.svelte.js';

export interface UseMediaTrackBySourceOrNameOptions {
	element?: HTMLMediaElement | null;
}

export interface UseMediaTrackBySourceOrNameReturn {
	publication: TrackPublication | undefined;
	isMuted: boolean | undefined;
	isSubscribed: boolean | undefined;
	track: import('livekit-client').Track | undefined;
	orientation: 'landscape' | 'portrait';
	elementProps: {
		className: string;
		'data-lk-local-participant': boolean;
		'data-lk-source': import('livekit-client').Track.Source | undefined;
		'data-lk-orientation'?: 'landscape' | 'portrait';
	};
}

export function useMediaTrackBySourceOrName(
	observerOptions: TrackIdentifier,
	options: UseMediaTrackBySourceOrNameOptions = {}
): UseMediaTrackBySourceOrNameReturn {
	const initialPublication = getTrackByIdentifier(observerOptions);

	const { className, trackObserver } = $derived(setupMediaTrack(observerOptions));

	const publication = useObservableState(trackObserver, initialPublication);

	const isMuted = $derived(publication?.isMuted);
	const isSubscribed = $derived(publication?.isSubscribed);
	const track = $derived(publication?.track);

	let previousElement: HTMLMediaElement | null = $state(null);

	$effect(() => {
		if (track && previousElement) {
			track.detach(previousElement);
		}
		if (options.element && !(observerOptions.participant.isLocal && track?.kind === 'audio')) {
			track?.attach(options.element);
		}
		previousElement = options.element ?? null;

		return () => {
			if (previousElement) {
				track?.detach(previousElement);
			}
		};
	});

	const orientation = $derived.by((): 'landscape' | 'portrait' => {
		if (
			typeof publication?.dimensions?.width === 'number' &&
			typeof publication?.dimensions?.height === 'number'
		) {
			return publication.dimensions.width > publication.dimensions.height
				? 'landscape'
				: 'portrait';
		}
		return 'landscape';
	});

	const elementProps = $derived({
		className,
		'data-lk-local-participant': observerOptions.participant.isLocal,
		'data-lk-source': publication?.source,
		...(publication?.kind === 'video' && { 'data-lk-orientation': orientation })
	});

	return {
		get publication() {
			return publication;
		},
		get isMuted() {
			return isMuted;
		},
		get isSubscribed() {
			return isSubscribed;
		},
		get track() {
			return track;
		},
		get orientation() {
			return orientation;
		},
		get elementProps() {
			return elementProps;
		}
	};
}
