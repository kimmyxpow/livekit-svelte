<script lang="ts">
	import type {
		AudioCaptureOptions,
		DisconnectReason,
		MediaDeviceFailure,
		RoomConnectOptions,
		RoomOptions,
		ScreenShareCaptureOptions,
		VideoCaptureOptions
	} from 'livekit-client';
	import type { Room } from 'livekit-client';
	import type { Snippet } from 'svelte';
	import type { FeatureFlags } from '../context/feature-context.svelte.js';
	import { setRoomContext } from '../context/room-context.svelte.js';
	import { setFeatureContext } from '../context/feature-context.svelte.js';
	import { useLiveKitRoom } from '../hooks/use-livekit-room.svelte.js';

	interface Props {
		/** URL to the LiveKit server. For example: `wss://<domain>.livekit.cloud` */
		serverUrl?: string;
		/** A user specific access token for a client to authenticate to the room. */
		token?: string;
		/** Publish audio immediately after connecting to your LiveKit room. @defaultValue `false` */
		audio?: AudioCaptureOptions | boolean;
		/** Publish video immediately after connecting to your LiveKit room. @defaultValue `false` */
		video?: VideoCaptureOptions | boolean;
		/** Publish screen share immediately after connecting to your LiveKit room. @defaultValue `false` */
		screen?: ScreenShareCaptureOptions | boolean;
		/** If set to true a connection to LiveKit room is initiated. @defaultValue `true` */
		connect?: boolean;
		/** Options for when creating a new room. */
		options?: RoomOptions;
		/** Define options how to connect to the LiveKit server. */
		connectOptions?: RoomConnectOptions;
		onConnected?: () => void;
		onDisconnected?: (reason?: DisconnectReason) => void;
		onError?: (error: Error) => void;
		onMediaDeviceFailure?: (failure?: MediaDeviceFailure, kind?: MediaDeviceKind) => void;
		onEncryptionError?: (error: Error) => void;
		/** Optional room instance. By passing your own room instance you overwrite the `options` parameter. */
		room?: Room;
		simulateParticipants?: number;
		/** @internal */
		featureFlags?: FeatureFlags;
		children?: Snippet;
	}

	let {
		serverUrl,
		token,
		audio = false,
		video = false,
		screen = false,
		connect = true,
		options,
		connectOptions,
		onConnected,
		onDisconnected,
		onError,
		onMediaDeviceFailure,
		onEncryptionError,
		room: passedRoom,
		simulateParticipants,
		featureFlags,
		children
	}: Props = $props();

	const { room, htmlProps } = useLiveKitRoom({
		get token() {
			return token;
		},
		get serverUrl() {
			return serverUrl;
		},
		get options() {
			return options;
		},
		get room() {
			return passedRoom;
		},
		get connectOptions() {
			return connectOptions;
		},
		get connect() {
			return connect;
		},
		get audio() {
			return audio;
		},
		get video() {
			return video;
		},
		get screen() {
			return screen;
		},
		get onConnected() {
			return onConnected;
		},
		get onDisconnected() {
			return onDisconnected;
		},
		get onError() {
			return onError;
		},
		get onMediaDeviceFailure() {
			return onMediaDeviceFailure;
		},
		get onEncryptionError() {
			return onEncryptionError;
		},
		get simulateParticipants() {
			return simulateParticipants;
		}
	});

	$effect(() => {
		if (room) {
			setRoomContext(room);
		}
	});

	$effect(() => {
		if (featureFlags) {
			setFeatureContext(featureFlags);
		}
	});
</script>

{#if room}
	<div class={htmlProps.class}>
		{@render children?.()}
	</div>
{/if}
