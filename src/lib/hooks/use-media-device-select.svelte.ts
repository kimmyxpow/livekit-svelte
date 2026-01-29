import { createActiveDeviceObservable, createMediaDeviceObserver } from '@livekit/components-core';
import type { Room } from 'livekit-client';
import { useObservableState } from './internal/observable-state.svelte.js';
import { ensureRoom } from '../context/room-context.svelte.js';

export interface UseMediaDeviceSelectOptions {
	kind: MediaDeviceKind;
	requestPermissions?: boolean;
}

export interface MediaDeviceSelectState {
	devices: MediaDeviceInfo[];
	activeDeviceId: string | undefined;
}

export function useMediaDeviceSelect(
	options: UseMediaDeviceSelectOptions | (() => UseMediaDeviceSelectOptions),
	room?: Room | (() => Room | undefined)
): MediaDeviceSelectState {
	const r = $derived(ensureRoom(typeof room === 'function' ? room() : room));
	const opts = $derived(typeof options === 'function' ? options() : options);

	const devicesObservable = $derived(
		createMediaDeviceObserver(opts.kind, undefined, opts.requestPermissions)
	);
	const activeDeviceObservable = $derived(createActiveDeviceObservable(r, opts.kind));

	const devices = useObservableState(devicesObservable, []);
	const activeDeviceId = useObservableState(activeDeviceObservable, '');

	return {
		get devices() {
			return devices;
		},
		get activeDeviceId() {
			return activeDeviceId || undefined;
		}
	};
}
