import { EventEmitter } from 'events';
import type { TypedEventEmitter } from '../types.js';
import {
	Room,
	RoomEvent,
	ConnectionState,
	Track,
	TokenSourceConfigurable,
	TokenSourceFixed,
	decodeTokenPayload,
	type TrackPublishOptions,
	type TokenSourceFetchOptions,
	type RoomConnectOptions
} from 'livekit-client';
import { type TrackReference } from '@livekit/components-core';
import { getRoomContext } from '../context/room-context.svelte.js';
import { useLocalParticipant } from './use-local-participant.svelte.js';
import { useAgent, useAgentTimeoutIdStore, type AgentState } from './use-agent.svelte.js';

/** @beta */
export enum SessionEvent {
	ConnectionStateChanged = 'connectionStateChanged',
	MediaDevicesError = 'mediaDevicesError',
	EncryptionError = 'encryptionError'
}

/** @beta */
export type SessionCallbacks = {
	[SessionEvent.ConnectionStateChanged]: (newAgentConnectionState: ConnectionState) => void;
	[SessionEvent.MediaDevicesError]: (error: Error) => void;
	[SessionEvent.EncryptionError]: (error: Error) => void;
};

/** @beta */
export type SessionConnectOptions = {
	signal?: AbortSignal;
	tracks?: {
		microphone?: {
			enabled?: boolean;
			publishOptions?: TrackPublishOptions;
		};
		camera?: {
			enabled?: boolean;
			publishOptions?: TrackPublishOptions;
		};
		screenShare?: {
			enabled?: boolean;
			publishOptions?: TrackPublishOptions;
		};
	};
	roomConnectOptions?: RoomConnectOptions;
};

/** @beta */
export type SwitchActiveDeviceOptions = {
	exact?: boolean;
};

type SessionStateCommon = {
	room: Room;
	internal: {
		emitter: TypedEventEmitter<SessionCallbacks>;
		tokenSource: TokenSourceConfigurable | TokenSourceFixed;
		agentConnectTimeoutMilliseconds?: number;
		agentTimeoutFailureReason: string | null;
		startAgentTimeout: (agentConnectTimeoutMilliseconds?: number) => void;
		clearAgentTimeout: () => void;
		clearAgentTimeoutFailureReason: () => void;
		updateAgentTimeoutState: (agentState: AgentState) => void;
		updateAgentTimeoutParticipantExists: (agentParticipantExists: boolean) => void;
	};
};

type SessionStateConnecting = SessionStateCommon & {
	connectionState: ConnectionState.Connecting;
	isConnected: false;
	local: {
		cameraTrack: undefined;
		microphoneTrack: undefined;
		screenShareTrack: undefined;
	};
};

type SessionStateConnected = SessionStateCommon & {
	connectionState:
		| ConnectionState.Connected
		| ConnectionState.Reconnecting
		| ConnectionState.SignalReconnecting;
	isConnected: true;
	local: {
		cameraTrack?: TrackReference;
		microphoneTrack?: TrackReference;
		screenShareTrack?: TrackReference;
	};
};

type SessionStateDisconnected = SessionStateCommon & {
	connectionState: ConnectionState.Disconnected;
	isConnected: false;
	local: {
		cameraTrack: undefined;
		microphoneTrack: undefined;
		screenShareTrack: undefined;
	};
};

type SessionActions = {
	waitUntilConnected: (signal?: AbortSignal) => Promise<void>;
	waitUntilDisconnected: (signal?: AbortSignal) => Promise<void>;
	prepareConnection: () => Promise<void>;
	start: (options?: SessionConnectOptions) => Promise<void>;
	end: () => Promise<void>;
};

/** @beta */
export type UseSessionReturn =
	| (SessionStateConnecting & SessionActions)
	| (SessionStateConnected & SessionActions)
	| (SessionStateDisconnected & SessionActions);

type UseSessionCommonOptions = {
	room?: Room;
	agentConnectTimeoutMilliseconds?: number;
};

type UseSessionConfigurableOptions = UseSessionCommonOptions & TokenSourceFetchOptions;
type UseSessionFixedOptions = UseSessionCommonOptions;

function _areTokenSourceFetchOptionsEqual(a: TokenSourceFetchOptions, b: TokenSourceFetchOptions) {
	const allKeysSet = new Set([...Object.keys(a), ...Object.keys(b)]) as Set<
		keyof TokenSourceFetchOptions
	>;

	for (const key of allKeysSet) {
		switch (key) {
			case 'roomName':
			case 'participantName':
			case 'participantIdentity':
			case 'participantMetadata':
			case 'participantAttributes':
			case 'agentName':
			case 'agentMetadata':
				if (a[key] !== b[key]) {
					return false;
				}
				break;
			default: {
				const exhaustiveCheckedKey: never = key;
				throw new Error(`Options key ${exhaustiveCheckedKey} not being checked for equality!`);
			}
		}
	}

	return true;
}

/**
 * A Session represents a managed connection to a Room which can contain Agents.
 * @beta
 */
export function useSession(
	tokenSource: TokenSourceConfigurable,
	options?: UseSessionConfigurableOptions
): UseSessionReturn;
export function useSession(
	tokenSource: TokenSourceFixed,
	options?: UseSessionFixedOptions
): UseSessionReturn;
export function useSession(
	tokenSource: TokenSourceConfigurable | TokenSourceFixed,
	options: UseSessionConfigurableOptions | UseSessionFixedOptions = {}
): UseSessionReturn {
	const { room: optionsRoom, agentConnectTimeoutMilliseconds, ...restOptions } = options;

	const roomFromContext = getRoomContext();
	const room = roomFromContext ?? optionsRoom ?? new Room();

	const emitter = new EventEmitter() as TypedEventEmitter<SessionCallbacks>;

	const generateDerivedConnectionStateValues = <State extends UseSessionReturn['connectionState']>(
		connectionState: State
	) =>
		({
			isConnected:
				connectionState === ConnectionState.Connected ||
				connectionState === ConnectionState.Reconnecting ||
				connectionState === ConnectionState.SignalReconnecting
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		}) as any;

	let roomConnectionState = $state(room.state);

	$effect(() => {
		const handleConnectionStateChanged = (connectionState: ConnectionState) => {
			roomConnectionState = connectionState;
		};

		room.on(RoomEvent.ConnectionStateChanged, handleConnectionStateChanged);
		return () => {
			room.off(RoomEvent.ConnectionStateChanged, handleConnectionStateChanged);
		};
	});

	$effect(() => {
		const handleMediaDevicesError = async (error: Error) => {
			emitter.emit(SessionEvent.MediaDevicesError, error);
		};

		room.on(RoomEvent.MediaDevicesError, handleMediaDevicesError);
		return () => {
			room.off(RoomEvent.MediaDevicesError, handleMediaDevicesError);
		};
	});

	$effect(() => {
		const handleEncryptionError = async (error: Error) => {
			emitter.emit(SessionEvent.EncryptionError, error);
		};

		room.on(RoomEvent.EncryptionError, handleEncryptionError);
		return () => {
			room.off(RoomEvent.EncryptionError, handleEncryptionError);
		};
	});

	const localParticipantMedia = useLocalParticipant(room);
	const localParticipant = localParticipantMedia.participant;
	const cameraPublication = localParticipantMedia.cameraTrack;
	const localCamera = $derived(
		cameraPublication
			? {
					source: Track.Source.Camera,
					participant: localParticipant,
					publication: cameraPublication
				}
			: undefined
	);

	const microphonePublication = localParticipantMedia.microphoneTrack;
	const localMicrophone = $derived(
		microphonePublication
			? {
					source: Track.Source.Microphone,
					participant: localParticipant,
					publication: microphonePublication
				}
			: undefined
	);

	const screenSharePublication = localParticipant.getTrackPublication(Track.Source.ScreenShare);
	const localScreenShare = $derived(
		screenSharePublication
			? {
					source: Track.Source.ScreenShare,
					participant: localParticipant,
					publication: screenSharePublication
				}
			: undefined
	);

	const {
		agentTimeoutFailureReason,
		startAgentTimeout,
		clearAgentTimeout,
		clearAgentTimeoutFailureReason,
		updateAgentTimeoutState,
		updateAgentTimeoutParticipantExists
	} = useAgentTimeoutIdStore();

	const sessionInternal: UseSessionReturn['internal'] = $derived({
		emitter,
		tokenSource,
		agentConnectTimeoutMilliseconds,
		agentTimeoutFailureReason,
		startAgentTimeout,
		clearAgentTimeout,
		clearAgentTimeoutFailureReason,
		updateAgentTimeoutState,
		updateAgentTimeoutParticipantExists
	});

	const conversationState = $derived.by<UseSessionReturn>(() => {
		const common: SessionStateCommon = {
			room,
			internal: sessionInternal
		};

		switch (roomConnectionState) {
			case ConnectionState.Connecting:
				return {
					...common,
					connectionState: ConnectionState.Connecting,
					...generateDerivedConnectionStateValues(ConnectionState.Connecting),
					local: {
						cameraTrack: undefined,
						microphoneTrack: undefined,
						screenShareTrack: undefined
					}
				};

			case ConnectionState.Connected:
			case ConnectionState.Reconnecting:
			case ConnectionState.SignalReconnecting:
				return {
					...common,
					connectionState: roomConnectionState,
					...generateDerivedConnectionStateValues(roomConnectionState),
					local: {
						cameraTrack: localCamera,
						microphoneTrack: localMicrophone,
						screenShareTrack: localScreenShare
					}
				};

			case ConnectionState.Disconnected:
				return {
					...common,
					connectionState: ConnectionState.Disconnected,
					...generateDerivedConnectionStateValues(ConnectionState.Disconnected),
					local: {
						cameraTrack: undefined,
						microphoneTrack: undefined,
						screenShareTrack: undefined
					}
				};
		}
	});

	$effect(() => {
		emitter.emit(SessionEvent.ConnectionStateChanged, conversationState.connectionState);
	});

	const waitUntilConnectionState = async (
		state: UseSessionReturn['connectionState'],
		signal?: AbortSignal
	) => {
		if (roomConnectionState === state) {
			return;
		}

		return new Promise<void>((resolve, reject) => {
			const onceEventOccurred = (newState: UseSessionReturn['connectionState']) => {
				if (newState !== state) {
					return;
				}
				cleanup();
				resolve();
			};
			const abortHandler = () => {
				cleanup();
				reject(
					new Error(
						`useSession(/* ... */).waitUntilConnectionState(${state}, /* signal */) - signal aborted`
					)
				);
			};

			const cleanup = () => {
				emitter.off(SessionEvent.ConnectionStateChanged, onceEventOccurred);
				signal?.removeEventListener('abort', abortHandler);
			};

			emitter.on(SessionEvent.ConnectionStateChanged, onceEventOccurred);
			signal?.addEventListener('abort', abortHandler);
		});
	};

	const waitUntilConnected = async (signal?: AbortSignal) => {
		return waitUntilConnectionState(ConnectionState.Connected, signal);
	};

	const waitUntilDisconnected = async (signal?: AbortSignal) => {
		return waitUntilConnectionState(ConnectionState.Disconnected, signal);
	};

	const isConfigurable = tokenSource instanceof TokenSourceConfigurable;
	const memoizedTokenFetchOptions: TokenSourceFetchOptions | null = isConfigurable
		? (restOptions as TokenSourceFetchOptions)
		: null;

	const tokenSourceFetch = async () => {
		if (isConfigurable) {
			if (!memoizedTokenFetchOptions) {
				throw new Error(
					`AgentSession - memoized token fetch options are not set, but the passed tokenSource was an instance of TokenSourceConfigurable. If you are seeing this please make a new GitHub issue!`
				);
			}
			return tokenSource.fetch(memoizedTokenFetchOptions);
		} else {
			return tokenSource.fetch();
		}
	};

	const agent = useAgent(conversationState);

	const start = async (connectOptions: SessionConnectOptions = {}) => {
		const {
			signal,
			tracks = { microphone: { enabled: true, publishOptions: { preConnectBuffer: true } } },
			roomConnectOptions
		} = connectOptions;

		await waitUntilDisconnected(signal);

		const onSignalAbort = () => {
			room.disconnect();
		};
		signal?.addEventListener('abort', onSignalAbort);

		let tokenDispatchesAgent = false;
		await Promise.all([
			tokenSourceFetch().then(({ serverUrl, participantToken }) => {
				const participantTokenPayload = decodeTokenPayload(participantToken);
				const participantTokenAgentDispatchCount =
					participantTokenPayload.roomConfig?.agents?.length ?? 0;
				tokenDispatchesAgent = participantTokenAgentDispatchCount > 0;

				return room.connect(serverUrl, participantToken, roomConnectOptions);
			}),

			// Start microphone (with preconnect buffer) by default
			tracks.microphone?.enabled
				? room.localParticipant.setMicrophoneEnabled(
						true,
						undefined,
						tracks.microphone?.publishOptions ?? {}
					)
				: Promise.resolve(),
			tracks.camera?.enabled
				? room.localParticipant.setCameraEnabled(
						true,
						undefined,
						tracks.camera?.publishOptions ?? {}
					)
				: Promise.resolve(),
			tracks.screenShare?.enabled
				? room.localParticipant.setScreenShareEnabled(
						true,
						undefined,
						tracks.screenShare?.publishOptions ?? {}
					)
				: Promise.resolve()
		]);

		await waitUntilConnected(signal);
		if (tokenDispatchesAgent) {
			await agent.waitUntilConnected(signal);
		}

		signal?.removeEventListener('abort', onSignalAbort);
	};

	const end = async () => {
		await room.disconnect();
	};

	const prepareConnection = async () => {
		const credentials = await tokenSourceFetch();
		await room.prepareConnection(credentials.serverUrl, credentials.participantToken);
	};

	$effect(() => {
		prepareConnection().catch((err) => {
			console.warn('WARNING: Room.prepareConnection failed:', err);
		});
	});

	return {
		...conversationState,
		waitUntilConnected,
		waitUntilDisconnected,
		prepareConnection,
		start,
		end
	};
}
