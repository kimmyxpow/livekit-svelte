import { setupStartVideo } from '@livekit/components-core';
import type { Room } from 'livekit-client';
import { ensureRoom } from '../context/room-context.svelte.js';
import { mergeProps } from '../utils.js';
import { useObservableState } from './internal/observable-state.svelte.js';

/** @alpha */
export interface UseStartVideoProps {
	room?: Room;
	props: Record<string, unknown>;
}

/**
 * In some browsers to start video playback in low power mode, the user must perform a user-initiated event such as clicking a button.
 * The `useStartVideo` hook returns an object with a boolean `canPlayVideo` flag
 * that indicates whether video playback is allowed in the current context,
 * as well as a `startVideo` function that can be called in a button `onClick` callback to start video playback in the current context.
 *
 * @alpha
 */
export function useStartVideo({ room, props }: UseStartVideoProps) {
	const roomEnsured = ensureRoom(room);
	const { className, roomVideoPlaybackAllowedObservable, handleStartVideoPlayback } =
		setupStartVideo();

	const observable = roomVideoPlaybackAllowedObservable(roomEnsured);
	const { canPlayVideo } = useObservableState(observable, {
		canPlayVideo: roomEnsured.canPlaybackVideo
	});

	const mergedProps = mergeProps(props, {
		className,
		onclick: () => {
			handleStartVideoPlayback(roomEnsured);
		},
		style: { display: canPlayVideo ? 'none' : 'block' }
	});

	return { mergedProps, canPlayVideo };
}
