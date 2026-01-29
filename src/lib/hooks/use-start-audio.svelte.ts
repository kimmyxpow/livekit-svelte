import { setupStartAudio } from '@livekit/components-core';
import type { Room } from 'livekit-client';
import { ensureRoom } from '../context/room-context.svelte.js';
import { mergeProps } from '../utils.js';
import { useObservableState } from './internal/observable-state.svelte.js';

/** @alpha */
export interface UseStartAudioProps {
	room?: Room;
	props: Record<string, unknown>;
}

/**
 * In many browsers to start audio playback, the user must perform a user-initiated event such as clicking a button.
 * The `useStartAudio` hook returns an object with a boolean `canPlayAudio` flag
 * that indicates whether audio playback is allowed in the current context,
 * as well as a `startAudio` function that can be called in a button `onClick` callback to start audio playback in the current context.
 *
 * @see Autoplay policy on MDN web docs for more info: {@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices#autoplay_policy}
 * @alpha
 */
export function useStartAudio({ room, props }: UseStartAudioProps) {
	const roomEnsured = ensureRoom(room);
	const { className, roomAudioPlaybackAllowedObservable, handleStartAudioPlayback } =
		setupStartAudio();

	const observable = roomAudioPlaybackAllowedObservable(roomEnsured);
	const { canPlayAudio } = useObservableState(observable, {
		canPlayAudio: roomEnsured.canPlaybackAudio
	});

	const mergedProps = mergeProps(props, {
		className,
		onclick: () => {
			handleStartAudioPlayback(roomEnsured);
		},
		style: { display: canPlayAudio ? 'none' : 'block' }
	});

	return { mergedProps, canPlayAudio };
}
