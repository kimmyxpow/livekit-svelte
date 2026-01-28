import { setupLiveKitRoom, log } from '@livekit/components-core';
import type {
	AudioCaptureOptions,
	DisconnectReason,
	RoomConnectOptions,
	RoomOptions,
	ScreenShareCaptureOptions,
	VideoCaptureOptions
} from 'livekit-client';
import { MediaDeviceFailure, Room, RoomEvent } from 'livekit-client';

export interface UseLiveKitRoomOptions {
	token?: string;
	serverUrl?: string;
	options?: RoomOptions;
	room?: Room;
	connectOptions?: RoomConnectOptions;
	connect?: boolean;
	audio?: AudioCaptureOptions | boolean;
	video?: VideoCaptureOptions | boolean;
	screen?: ScreenShareCaptureOptions | boolean;
	onConnected?: () => void;
	onDisconnected?: (reason?: DisconnectReason) => void;
	onError?: (error: Error) => void;
	onMediaDeviceFailure?: (failure?: MediaDeviceFailure, kind?: MediaDeviceKind) => void;
	onEncryptionError?: (error: Error) => void;
	simulateParticipants?: number;
}

export interface UseLiveKitRoomReturn {
	room: Room | undefined;
	htmlProps: {
		class?: string;
	};
}

export function useLiveKitRoom(options: UseLiveKitRoomOptions = {}): UseLiveKitRoomReturn {
	// Use $derived to access reactive values from getters
	const token = $derived(options.token);
	const serverUrl = $derived(options.serverUrl);
	const roomOptions = $derived(options.options);
	const passedRoom = $derived(options.room);
	const connectOptions = $derived(options.connectOptions);
	const connect = $derived(options.connect ?? true);
	const audio = $derived(options.audio ?? false);
	const video = $derived(options.video ?? false);
	const screen = $derived(options.screen ?? false);
	const onConnected = $derived(options.onConnected);
	const onDisconnected = $derived(options.onDisconnected);
	const onError = $derived(options.onError);
	const onMediaDeviceFailure = $derived(options.onMediaDeviceFailure);
	const onEncryptionError = $derived(options.onEncryptionError);
	const simulateParticipants = $derived(options.simulateParticipants);

	if (roomOptions && passedRoom) {
		log.warn(
			'when using a manually created room, the options object will be ignored. set the desired options directly when creating the room instead.'
		);
	}

	// Create room instance
	let room = $state<Room | undefined>(passedRoom);

	$effect(() => {
		if (!room && passedRoom) {
			room = passedRoom;
		}
	});

	// Get className from setupLiveKitRoom
	const { className } = setupLiveKitRoom();

	// Handle room events and media publishing
	$effect(() => {
		if (!room) return;

		const onSignalConnected = () => {
			const localP = room!.localParticipant;

			log.debug('trying to publish local tracks');
			Promise.all([
				localP.setMicrophoneEnabled(!!audio, typeof audio !== 'boolean' ? audio : undefined),
				localP.setCameraEnabled(!!video, typeof video !== 'boolean' ? video : undefined),
				localP.setScreenShareEnabled(!!screen, typeof screen !== 'boolean' ? screen : undefined)
			]).catch((e) => {
				log.warn(e);
				onError?.(e as Error);
			});
		};

		const handleMediaDeviceError = (e: Error, kind?: MediaDeviceKind) => {
			const mediaDeviceFailure = MediaDeviceFailure.getFailure(e);
			onMediaDeviceFailure?.(mediaDeviceFailure, kind);
		};

		const handleEncryptionError = (e: Error) => {
			onEncryptionError?.(e);
		};

		const handleDisconnected = (reason?: DisconnectReason) => {
			onDisconnected?.(reason);
		};

		const handleConnected = () => {
			onConnected?.();
		};

		room
			.on(RoomEvent.SignalConnected, onSignalConnected)
			.on(RoomEvent.MediaDevicesError, handleMediaDeviceError)
			.on(RoomEvent.EncryptionError, handleEncryptionError)
			.on(RoomEvent.Disconnected, handleDisconnected)
			.on(RoomEvent.Connected, handleConnected);

		return () => {
			room
				?.off(RoomEvent.SignalConnected, onSignalConnected)
				.off(RoomEvent.MediaDevicesError, handleMediaDeviceError)
				.off(RoomEvent.EncryptionError, handleEncryptionError)
				.off(RoomEvent.Disconnected, handleDisconnected)
				.off(RoomEvent.Connected, handleConnected);
		};
	});

	// Handle connection
	let shouldConnect = $state(connect);

	$effect(() => {
		if (!room) return;

		if (simulateParticipants) {
			room.simulateParticipants({
				participants: {
					count: simulateParticipants
				},
				publish: {
					audio: true,
					useRealTracks: true
				}
			});
			return;
		}

		if (shouldConnect && connect) {
			log.debug('connecting');
			if (!token) {
				log.debug('no token yet');
				return;
			}
			if (!serverUrl) {
				log.warn('no livekit url provided');
				onError?.(Error('no livekit url provided'));
				return;
			}
			room.connect(serverUrl, token, connectOptions).catch((e) => {
				log.warn(e);
				if (shouldConnect === true) {
					onError?.(e as Error);
				}
			});
		} else if (!connect) {
			log.debug('disconnecting because connect is false');
			shouldConnect = false;
			room.disconnect();
		}
	});

	// Cleanup on destroy
	$effect(() => {
		return () => {
			if (room) {
				log.info('disconnecting on unmount');
				room.disconnect();
			}
		};
	});

	return {
		get room() {
			return room;
		},
		htmlProps: {
			class: className
		}
	};
}
