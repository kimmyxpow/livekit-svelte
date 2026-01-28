import type {
	SourcesArray,
	TrackReference,
	TrackReferenceOrPlaceholder,
	TrackSourceWithOptions,
	TrackReferencePlaceholder
} from '@livekit/components-core';
import {
	isSourcesWithOptions,
	isSourceWitOptions,
	log,
	trackReferencesObservable
} from '@livekit/components-core';
import type { Participant, Room, RoomEvent } from 'livekit-client';
import { Track } from 'livekit-client';
import { SvelteMap, SvelteSet } from 'svelte/reactivity';
import { ensureRoom } from '../context/room-context.svelte.js';
import { useObservableState } from './internal/observable-state.svelte.js';

export interface UseTracksOptions {
	updateOnlyOn?: RoomEvent[];
	onlySubscribed?: boolean;
	room?: Room;
}

export type UseTracksHookReturnType<T> = T extends Track.Source[]
	? TrackReference[]
	: T extends TrackSourceWithOptions[]
		? TrackReferenceOrPlaceholder[]
		: never;

/**
 * The `useTracks` hook returns an array of `TrackReference` or `TrackReferenceOrPlaceholder` depending on the provided `sources` property.
 * If only subscribed tracks are desired, set the `onlySubscribed` property to `true`.
 * @example
 * ```ts
 * // Return all camera track publications.
 * const trackReferences: TrackReference[] = useTracks([Track.Source.Camera])
 * ```
 * @example
 * ```ts
 * // Return all subscribed camera tracks as well as placeholders for
 * // participants without a camera subscription.
 * const trackReferencesWithPlaceholders: TrackReferenceOrPlaceholder[] = useTracks([{source: Track.Source.Camera, withPlaceholder: true}])
 * ```
 */
export function useTracks<T extends SourcesArray = Track.Source[]>(
	sources: T = [
		Track.Source.Camera,
		Track.Source.Microphone,
		Track.Source.ScreenShare,
		Track.Source.ScreenShareAudio,
		Track.Source.Unknown
	] as T,
	options: UseTracksOptions = {}
): UseTracksHookReturnType<T> {
	const room = $derived(ensureRoom(options.room));

	const sources_ = sources.map((s) => (isSourceWitOptions(s) ? s.source : s));

	const observable = trackReferencesObservable(room, sources_, {
		additionalRoomEvents: options.updateOnlyOn,
		onlySubscribed: options.onlySubscribed
	});

	const result = useObservableState(observable, { trackReferences: [], participants: [] });

	// Compute track references with placeholders if needed
	return $derived.by(() => {
		if (isSourcesWithOptions(sources)) {
			const requirePlaceholder = requiredPlaceholders(sources, result.participants);
			const trackReferencesWithPlaceholders: TrackReferenceOrPlaceholder[] = Array.from(
				result.trackReferences
			);

			result.participants.forEach((participant) => {
				if (requirePlaceholder.has(participant.identity)) {
					const sourcesToAddPlaceholder = requirePlaceholder.get(participant.identity) ?? [];
					sourcesToAddPlaceholder.forEach((placeholderSource) => {
						if (
							result.trackReferences.find(
								({ participant: p, publication }) =>
									participant.identity === p.identity && publication.source === placeholderSource
							)
						) {
							return;
						}
						log.debug(
							`Add ${placeholderSource} placeholder for participant ${participant.identity}.`
						);
						const placeholder: TrackReferencePlaceholder = {
							participant,
							source: placeholderSource
						};
						trackReferencesWithPlaceholders.push(placeholder);
					});
				}
			});
			return trackReferencesWithPlaceholders as UseTracksHookReturnType<T>;
		} else {
			return result.trackReferences as UseTracksHookReturnType<T>;
		}
	});
}

function difference<T>(setA: SvelteSet<T>, setB: SvelteSet<T>): SvelteSet<T> {
	const _difference = new SvelteSet(setA);
	for (const elem of setB) {
		_difference.delete(elem);
	}
	return _difference;
}

export function requiredPlaceholders<T extends SourcesArray>(
	sources: T,
	participants: Participant[]
): SvelteMap<Participant['identity'], Track.Source[]> {
	const placeholderMap = new SvelteMap<Participant['identity'], Track.Source[]>();
	if (isSourcesWithOptions(sources)) {
		const sourcesThatNeedPlaceholder = sources
			.filter((sourceWithOption) => sourceWithOption.withPlaceholder)
			.map((sourceWithOption) => sourceWithOption.source);

		participants.forEach((participant) => {
			const sourcesOfSubscribedTracks = participant
				.getTrackPublications()
				.map((pub) => pub.track?.source)
				.filter((trackSource): trackSource is Track.Source => trackSource !== undefined);
			const placeholderNeededForThisParticipant = Array.from(
				difference(
					new SvelteSet(sourcesThatNeedPlaceholder),
					new SvelteSet(sourcesOfSubscribedTracks)
				)
			);
			// If the participant needs placeholder add it to the placeholder map.
			if (placeholderNeededForThisParticipant.length > 0) {
				placeholderMap.set(participant.identity, placeholderNeededForThisParticipant);
			}
		});
	}
	return placeholderMap;
}
