import { createMediaDeviceObserver } from '@livekit/components-core';
import { useObservableState } from './internal/observable-state.svelte.js';

export interface UseMediaDevicesOptions {
	onError?: (e: Error) => void;
	requestPermissions?: boolean;
}

export function useMediaDevices(
	kind?: MediaDeviceKind,
	options?: UseMediaDevicesOptions
): MediaDeviceInfo[] {
	const observable = createMediaDeviceObserver(kind, options?.onError, options?.requestPermissions);
	return useObservableState(observable, []);
}
