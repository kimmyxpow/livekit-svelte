import { Track, type Room } from 'livekit-client';
import { ensureRoom } from '../context/room-context.svelte.js';

export interface UseTrackToggleOptions {
	source: Track.Source;
}

export interface UseTrackToggleReturn {
	enabled: boolean;
	toggle: () => Promise<void>;
	pending: boolean;
}

export function useTrackToggle(
	options: UseTrackToggleOptions | (() => UseTrackToggleOptions),
	room?: Room | (() => Room | undefined)
): UseTrackToggleReturn {
	const r = $derived(ensureRoom(typeof room === 'function' ? room() : room));
	const source = $derived(typeof options === 'function' ? options().source : options.source);
	let pending = $state(false);

	const enabled = $derived.by(() => {
		switch (source) {
			case Track.Source.Camera:
				return r.localParticipant.isCameraEnabled;
			case Track.Source.Microphone:
				return r.localParticipant.isMicrophoneEnabled;
			case Track.Source.ScreenShare:
				return r.localParticipant.isScreenShareEnabled;
			default:
				return false;
		}
	});

	async function toggle() {
		pending = true;
		try {
			switch (source) {
				case Track.Source.Camera:
					await r.localParticipant.setCameraEnabled(!enabled);
					break;
				case Track.Source.Microphone:
					await r.localParticipant.setMicrophoneEnabled(!enabled);
					break;
				case Track.Source.ScreenShare:
					await r.localParticipant.setScreenShareEnabled(!enabled);
					break;
			}
		} finally {
			pending = false;
		}
	}

	return {
		get enabled() {
			return enabled;
		},
		toggle,
		get pending() {
			return pending;
		}
	};
}
