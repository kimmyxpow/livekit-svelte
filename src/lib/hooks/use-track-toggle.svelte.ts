import type { CaptureOptionsBySource, ToggleSource } from '@livekit/components-core';
import { setupMediaToggle, setupManualToggle } from '@livekit/components-core';
import type { Room, TrackPublishOptions, TrackPublication } from 'livekit-client';
import { useMaybeRoomContext } from '../context/room-context.svelte.js';
import { useObservableState } from './internal/observable-state.svelte.js';

/** @deprecated Use UseTrackToggleProps instead */
export type UseTrackToggleOptions<T extends ToggleSource> = UseTrackToggleProps<T>;

export interface UseTrackToggleProps<T extends ToggleSource> {
	source: T;
	initialState?: boolean;
	captureOptions?: CaptureOptionsBySource<T>;
	publishOptions?: TrackPublishOptions;
	onDeviceError?: (error: Error) => void;
	room?: Room;
}

export interface UseTrackToggleReturn<T extends ToggleSource> {
	toggle: (
		forceState?: boolean,
		captureOptions?: CaptureOptionsBySource<T>
	) => Promise<boolean | undefined> | Promise<void>;
	enabled: boolean;
	pending: boolean;
	track: TrackPublication | undefined;
	buttonProps: {
		'aria-pressed': boolean;
		'data-lk-source': T;
		'data-lk-enabled': boolean;
		disabled: boolean;
		className: string;
	};
}

export function useTrackToggle<T extends ToggleSource>(
	props: UseTrackToggleProps<T> | (() => UseTrackToggleProps<T>)
): UseTrackToggleReturn<T> {
	const roomFromContext = useMaybeRoomContext();
	const resolvedProps = $derived(typeof props === 'function' ? props() : props);
	const room = $derived(resolvedProps.room ?? roomFromContext);
	const track = $derived(room?.localParticipant?.getTrackPublication(resolvedProps.source));

	const setup = $derived(
		room
			? setupMediaToggle<T>(
					resolvedProps.source,
					room,
					resolvedProps.captureOptions,
					resolvedProps.publishOptions,
					resolvedProps.onDeviceError
				)
			: setupManualToggle()
	);

	const pending = useObservableState(setup.pendingObserver, false);
	const enabled = useObservableState(
		setup.enabledObserver,
		resolvedProps.initialState ?? !!track?.isEnabled
	);

	return {
		get toggle() {
			return setup.toggle;
		},
		get enabled() {
			return enabled;
		},
		get pending() {
			return pending;
		},
		get track() {
			return track;
		},
		get buttonProps() {
			return {
				'aria-pressed': enabled,
				'data-lk-source': resolvedProps.source,
				'data-lk-enabled': enabled,
				disabled: pending,
				className: setup.className
			};
		}
	};
}
