import type { LocalUserChoices } from '@livekit/components-core';
import { loadUserChoices, saveUserChoices } from '@livekit/components-core';

/**
 * Options for the `usePersistentUserChoices` hook.
 * @alpha
 */
export interface UsePersistentUserChoicesOptions {
	/**
	 * The default value to use if reading from local storage returns no results or fails.
	 */
	defaults?: Partial<LocalUserChoices>;
	/**
	 * Whether to prevent saving to persistent storage.
	 * @defaultValue false
	 */
	preventSave?: boolean;
	/**
	 * Whether to prevent loading user choices from persistent storage and use `defaults` instead.
	 * @defaultValue false
	 */
	preventLoad?: boolean;
}

/**
 * A hook that provides access to user choices stored in local storage, such as
 * selected media devices and their current state (on or off), as well as the user name.
 * @alpha
 */
export function usePersistentUserChoices(options: UsePersistentUserChoicesOptions = {}) {
	const initialChoices = loadUserChoices(options.defaults, options.preventLoad ?? false);

	let userChoices = $state<LocalUserChoices>(initialChoices);

	const saveAudioInputEnabled = (isEnabled: boolean) => {
		userChoices = { ...userChoices, audioEnabled: isEnabled };
	};

	const saveVideoInputEnabled = (isEnabled: boolean) => {
		userChoices = { ...userChoices, videoEnabled: isEnabled };
	};

	const saveAudioInputDeviceId = (deviceId: string) => {
		userChoices = { ...userChoices, audioDeviceId: deviceId };
	};

	const saveVideoInputDeviceId = (deviceId: string) => {
		userChoices = { ...userChoices, videoDeviceId: deviceId };
	};

	const saveUsername = (username: string) => {
		userChoices = { ...userChoices, username };
	};

	$effect(() => {
		saveUserChoices(userChoices, options.preventSave ?? false);
	});

	return {
		userChoices,
		saveAudioInputEnabled,
		saveVideoInputEnabled,
		saveAudioInputDeviceId,
		saveVideoInputDeviceId,
		saveUsername
	};
}
