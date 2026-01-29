import {
	ConnectionState,
	LocalTrackPublication,
	ParticipantEvent,
	ParticipantKind,
	RemoteParticipant,
	RoomEvent,
	Track,
	Participant
} from 'livekit-client';
import { EventEmitter } from 'events';
import type { TypedEventEmitter } from '../types.js';
import { ParticipantAgentAttributes, type TrackReference } from '@livekit/components-core';
import { useParticipantTracks } from './use-participant-tracks.svelte.js';
import { useRemoteParticipants } from './use-remote-participants.svelte.js';
import { useParticipantInfo } from './use-participant-info.svelte.js';
import { getSessionContext } from '../context/session-context.svelte.js';
import type { UseSessionReturn } from './use-session.svelte.js';

// FIXME: make this 10 seconds once room dispatch booting info is discoverable
const DEFAULT_AGENT_CONNECT_TIMEOUT_MILLISECONDS = 20_000;

/** @see https://github.com/livekit/agents/blob/65170238db197f62f479eb7aaef1c0e18bfad6e7/livekit-agents/livekit/agents/voice/events.py#L97 */
type AgentSdkStates = 'initializing' | 'idle' | 'listening' | 'thinking' | 'speaking';

/**
 * State representing the current status of the agent, whether it is ready for speech, etc
 *
 * @beta
 * */
export type AgentState =
	| 'disconnected'
	| 'connecting'
	| 'pre-connect-buffering'
	| 'failed'
	| AgentSdkStates;

/** @beta */
export enum AgentEvent {
	CameraChanged = 'cameraChanged',
	MicrophoneChanged = 'microphoneChanged',
	StateChanged = 'stateChanged'
}

/** @beta */
export type AgentCallbacks = {
	[AgentEvent.CameraChanged]: (newTrack: TrackReference | undefined) => void;
	[AgentEvent.MicrophoneChanged]: (newTrack: TrackReference | undefined) => void;
	[AgentEvent.StateChanged]: (newAgentState: AgentState) => void;
};

type AgentStateCommon = {
	attributes: Participant['attributes'];
	internal: {
		emitter: TypedEventEmitter<AgentCallbacks>;
		agentParticipant: RemoteParticipant | null;
		workerParticipant: RemoteParticipant | null;
	};
};

type AgentStateAvailable = AgentStateCommon & {
	state: 'listening' | 'thinking' | 'speaking';
	failureReasons: null;
	identity: Participant['identity'];
	name: Participant['name'];
	metadata: Participant['metadata'];
	isConnected: true;
	canListen: true;
	isFinished: false;
	isPending: false;
	cameraTrack?: TrackReference;
	microphoneTrack?: TrackReference;
};

type AgentStatePreConnectBuffering = AgentStateCommon & {
	state: 'pre-connect-buffering';
	failureReasons: null;
	identity: Participant['identity'];
	name: Participant['name'];
	metadata: Participant['metadata'];
	isConnected: false;
	canListen: true;
	isFinished: false;
	isPending: false;
	cameraTrack?: TrackReference;
	microphoneTrack?: TrackReference;
};

type AgentStateUnAvailable = AgentStateCommon & {
	state: 'initializing' | 'idle';
	failureReasons: null;
	identity: Participant['identity'];
	name: Participant['name'];
	metadata: Participant['metadata'];
	isConnected: false;
	canListen: false;
	isFinished: false;
	isPending: true;
	cameraTrack?: TrackReference;
	microphoneTrack?: TrackReference;
};

type AgentStateConnecting = AgentStateCommon & {
	state: 'connecting';
	failureReasons: null;
	identity: undefined;
	name: undefined;
	metadata: undefined;
	isConnected: false;
	canListen: false;
	isFinished: false;
	isPending: true;
	cameraTrack: undefined;
	microphoneTrack: undefined;
};

type AgentStateDisconnected = AgentStateCommon & {
	state: 'disconnected';
	failureReasons: null;
	identity: undefined;
	name: undefined;
	metadata: undefined;
	isConnected: false;
	canListen: false;
	isFinished: true;
	isPending: false;
	cameraTrack: undefined;
	microphoneTrack: undefined;
};

type AgentStateFailed = AgentStateCommon & {
	state: 'failed';
	failureReasons: Array<string>;
	identity: undefined;
	name: undefined;
	metadata: undefined;
	isConnected: false;
	canListen: false;
	isFinished: true;
	isPending: false;
	cameraTrack: undefined;
	microphoneTrack: undefined;
};

type AgentActions = {
	waitUntilConnected: (signal?: AbortSignal) => Promise<void>;
	waitUntilCouldBeListening: (signal?: AbortSignal) => Promise<void>;
	waitUntilFinished: (signal?: AbortSignal) => Promise<void>;
	waitUntilCamera: (signal?: AbortSignal) => Promise<TrackReference>;
	waitUntilMicrophone: (signal?: AbortSignal) => Promise<TrackReference>;
};

type AgentStateCases =
	| AgentStateConnecting
	| AgentStateDisconnected
	| AgentStateAvailable
	| AgentStatePreConnectBuffering
	| AgentStateUnAvailable
	| AgentStateFailed;

/** @beta */
export type UseAgentReturn = AgentStateCases & AgentActions;

const generateDerivedStateValues = <State extends AgentState>(state: State) =>
	({
		isConnected: state === 'listening' || state === 'thinking' || state === 'speaking',
		canListen:
			state === 'pre-connect-buffering' ||
			state === 'listening' ||
			state === 'thinking' ||
			state === 'speaking',
		isFinished: state === 'disconnected' || state === 'failed',
		isPending: state === 'connecting' || state === 'initializing' || state === 'idle'
	}) as {
		isConnected: State extends 'listening' | 'thinking' | 'speaking' ? true : false;
		canListen: State extends 'pre-connect-buffering' | 'listening' | 'thinking' | 'speaking'
			? true
			: false;
		isFinished: State extends 'disconnected' | 'failed' ? true : false;
		isPending: State extends 'connecting' | 'initializing' | 'idle' ? true : false;
	};

type SessionStub = Pick<UseSessionReturn, 'connectionState' | 'room' | 'internal'>;

/** @beta */
export const useAgentTimeoutIdStore = () => {
	let agentTimeoutFailureReason = $state<string | null>(null);
	let agentTimeoutId = $state<ReturnType<typeof setTimeout> | null>(null);
	let agentStateRef: AgentState = 'connecting';
	let agentParticipantExistsRef = false;

	const startAgentConnectedTimeout = (agentConnectTimeoutMilliseconds?: number) => {
		return setTimeout(() => {
			if (!agentParticipantExistsRef) {
				agentTimeoutFailureReason = 'Agent did not join the room.';
				return;
			}

			const { isConnected } = generateDerivedStateValues(agentStateRef);
			if (!isConnected) {
				agentTimeoutFailureReason = 'Agent joined the room but did not complete initializing.';
				return;
			}
		}, agentConnectTimeoutMilliseconds ?? DEFAULT_AGENT_CONNECT_TIMEOUT_MILLISECONDS);
	};

	return {
		agentTimeoutFailureReason,
		startAgentTimeout: (agentConnectTimeoutMilliseconds?: number) => {
			if (agentTimeoutId) {
				clearTimeout(agentTimeoutId);
			}

			agentTimeoutFailureReason = null;
			agentTimeoutId = startAgentConnectedTimeout(agentConnectTimeoutMilliseconds);
			agentStateRef = 'connecting';
			agentParticipantExistsRef = false;
		},
		clearAgentTimeout: () => {
			if (agentTimeoutId) {
				clearTimeout(agentTimeoutId);
			}

			agentTimeoutFailureReason = null;
			agentTimeoutId = null;
			agentStateRef = 'connecting';
			agentParticipantExistsRef = false;
		},
		clearAgentTimeoutFailureReason: () => {
			agentTimeoutFailureReason = null;
		},
		updateAgentTimeoutState: (agentState: AgentState) => {
			agentStateRef = agentState;
		},
		updateAgentTimeoutParticipantExists: (agentParticipantExists: boolean) => {
			agentParticipantExistsRef = agentParticipantExists;
		}
	};
};

/**
 * useAgent encapsulates all agent state, normalizing some quirks around how LiveKit Agents work.
 * @beta
 */
export function useAgent(session?: SessionStub): UseAgentReturn {
	const sessionFromContext = getSessionContext();
	const activeSession = session ?? sessionFromContext;
	if (!activeSession) {
		throw new Error(
			'No session provided, make sure you are inside a Session context or pass the session explicitly'
		);
	}

	const {
		room,
		internal: {
			agentConnectTimeoutMilliseconds,
			agentTimeoutFailureReason,
			startAgentTimeout,
			clearAgentTimeout,
			clearAgentTimeoutFailureReason,
			updateAgentTimeoutState,
			updateAgentTimeoutParticipantExists
		}
	} = activeSession;

	const emitter = new EventEmitter() as TypedEventEmitter<AgentCallbacks>;

	const roomRemoteParticipants = useRemoteParticipants(undefined, room);

	const agentParticipant = $derived(
		roomRemoteParticipants.find(
			(p) =>
				p.kind === ParticipantKind.AGENT &&
				!(ParticipantAgentAttributes.PublishOnBehalf in p.attributes)
		) ?? null
	);

	const workerParticipant = $derived(
		agentParticipant
			? (roomRemoteParticipants.find(
					(p) =>
						p.kind === ParticipantKind.AGENT &&
						p.attributes[ParticipantAgentAttributes.PublishOnBehalf] === agentParticipant.identity
				) ?? null)
			: null
	);

	// Listen for agent participant attribute changes
	let agentParticipantAttributes = $state<Participant['attributes']>(
		agentParticipant?.attributes ?? {}
	);

	$effect(() => {
		if (!agentParticipant) {
			return;
		}

		const handleAttributesChanged = (attributes: UseAgentReturn['attributes']) => {
			agentParticipantAttributes = attributes;
		};

		agentParticipant.on(ParticipantEvent.AttributesChanged, handleAttributesChanged);
		return () => {
			agentParticipant.off(ParticipantEvent.AttributesChanged, handleAttributesChanged);
		};
	});

	// Listen for track updates
	const agentTracks = useParticipantTracks([Track.Source.Camera, Track.Source.Microphone], {
		room,
		participantIdentity: agentParticipant?.identity
	});
	const workerTracks = useParticipantTracks([Track.Source.Camera, Track.Source.Microphone], {
		room,
		participantIdentity: workerParticipant?.identity
	});

	const videoTrack = $derived(
		agentTracks.find((t) => t.source === Track.Source.Camera) ??
			workerTracks.find((t) => t.source === Track.Source.Camera)
	);

	const audioTrack = $derived(
		agentTracks.find((t) => t.source === Track.Source.Microphone) ??
			workerTracks.find((t) => t.source === Track.Source.Microphone)
	);

	// Listen for room connection state updates
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

	// When the agent participant connects, reset the timeout failure state
	$effect(() => {
		if (!agentParticipant) {
			return;
		}
		clearAgentTimeoutFailureReason();
	});

	// If the agent participant disconnects in the middle of a conversation unexpectedly, mark that as an explicit failure
	let agentDisconnectedFailureReason = $state<string | null>(null);
	$effect(() => {
		if (!agentParticipant) {
			return;
		}

		const onParticipantDisconnect = (participant: RemoteParticipant) => {
			if (participant.identity !== agentParticipant?.identity) {
				return;
			}
			agentDisconnectedFailureReason = 'Agent left the room unexpectedly.';
		};

		room.on(RoomEvent.ParticipantDisconnected, onParticipantDisconnect);

		return () => {
			room.off(RoomEvent.ParticipantDisconnected, onParticipantDisconnect);
		};
	});

	$effect(() => {
		if (roomConnectionState !== ConnectionState.Disconnected) {
			return;
		}
		// Clear the agent disconnect failure state when the room disconnects
		agentDisconnectedFailureReason = null;
	});

	let localMicTrack = $state<LocalTrackPublication | null>(
		room.localParticipant.getTrackPublication(Track.Source.Microphone) ?? null
	);
	$effect(() => {
		const handleLocalParticipantTrackPublished = () => {
			localMicTrack = room.localParticipant.getTrackPublication(Track.Source.Microphone) ?? null;
		};
		const handleLocalParticipantTrackUnPublished = () => {
			localMicTrack = null;
		};

		room.localParticipant.on(
			ParticipantEvent.LocalTrackPublished,
			handleLocalParticipantTrackPublished
		);
		room.localParticipant.on(
			ParticipantEvent.LocalTrackUnpublished,
			handleLocalParticipantTrackUnPublished
		);
		return () => {
			room.localParticipant.off(
				ParticipantEvent.LocalTrackPublished,
				handleLocalParticipantTrackPublished
			);
			room.localParticipant.off(
				ParticipantEvent.LocalTrackUnpublished,
				handleLocalParticipantTrackUnPublished
			);
		};
	});

	const failureReasons = $derived(
		[agentTimeoutFailureReason, agentDisconnectedFailureReason].filter(
			(r): r is string => r !== null
		)
	);

	const state = $derived.by<AgentState>(() => {
		if (failureReasons.length > 0) {
			return 'failed';
		}

		let state: AgentState = 'disconnected';

		if (roomConnectionState !== ConnectionState.Disconnected) {
			state = 'connecting';
		}

		// If the microphone preconnect buffer is active, then a special 'pre-connect-buffering' state
		// is set
		if (localMicTrack) {
			state = 'pre-connect-buffering';
		}

		if (agentParticipant && agentParticipantAttributes[ParticipantAgentAttributes.AgentState]) {
			state = agentParticipantAttributes[ParticipantAgentAttributes.AgentState] as AgentSdkStates;
		}

		return state;
	});

	$effect(() => {
		emitter.emit(AgentEvent.StateChanged, state);
		updateAgentTimeoutState(state);
	});

	$effect(() => {
		updateAgentTimeoutParticipantExists(agentParticipant !== null);
	});

	// When the session room begins connecting, start the agent timeout
	const isSessionDisconnected = activeSession.connectionState === 'disconnected';
	$effect(() => {
		if (isSessionDisconnected) {
			return;
		}

		startAgentTimeout(agentConnectTimeoutMilliseconds);
		return () => {
			clearAgentTimeout();
		};
	});

	const {
		identity: agentParticipantIdentity,
		name: agentParticipantName,
		metadata: agentParticipantMetadata
	} = useParticipantInfo(agentParticipant ?? undefined);

	const agentState: AgentStateCases = $derived.by(() => {
		const common: AgentStateCommon = {
			attributes: agentParticipantAttributes,
			internal: {
				agentParticipant,
				workerParticipant,
				emitter
			}
		};

		switch (state) {
			case 'disconnected':
				return {
					...common,
					identity: undefined,
					name: undefined,
					metadata: undefined,
					state,
					...generateDerivedStateValues(state),
					failureReasons: null,
					cameraTrack: undefined,
					microphoneTrack: undefined
				};

			case 'connecting':
				return {
					...common,
					identity: undefined,
					name: undefined,
					metadata: undefined,
					state,
					...generateDerivedStateValues(state),
					failureReasons: null,
					cameraTrack: undefined,
					microphoneTrack: undefined
				};

			case 'initializing':
			case 'idle':
				return {
					...common,
					identity: agentParticipantIdentity!,
					name: agentParticipantName,
					metadata: agentParticipantMetadata,
					state,
					...generateDerivedStateValues(state),
					failureReasons: null,
					cameraTrack: videoTrack,
					microphoneTrack: audioTrack
				};

			case 'pre-connect-buffering':
				return {
					...common,
					identity: agentParticipantIdentity!,
					name: agentParticipantName,
					metadata: agentParticipantMetadata,
					state,
					...generateDerivedStateValues(state),
					failureReasons: null,
					cameraTrack: videoTrack,
					microphoneTrack: audioTrack
				};

			case 'listening':
			case 'thinking':
			case 'speaking':
				return {
					...common,
					identity: agentParticipantIdentity!,
					name: agentParticipantName,
					metadata: agentParticipantMetadata,
					state,
					...generateDerivedStateValues(state),
					failureReasons: null,
					cameraTrack: videoTrack,
					microphoneTrack: audioTrack
				};

			case 'failed':
				return {
					...common,
					identity: undefined,
					name: undefined,
					metadata: undefined,
					state: 'failed',
					...generateDerivedStateValues('failed'),
					failureReasons,
					cameraTrack: undefined,
					microphoneTrack: undefined
				};
		}
	});

	const waitUntilConnected = async (signal?: AbortSignal) => {
		const { isConnected } = generateDerivedStateValues(state);
		if (isConnected) {
			return;
		}

		return new Promise<void>((resolve, reject) => {
			const stateChangedHandler = (newState: AgentState) => {
				const { isConnected } = generateDerivedStateValues(newState);
				if (!isConnected) {
					return;
				}
				cleanup();
				resolve();
			};
			const abortHandler = () => {
				cleanup();
				reject(new Error('useAgent(/* ... */).waitUntilConnected - signal aborted'));
			};

			const cleanup = () => {
				emitter.off(AgentEvent.StateChanged, stateChangedHandler);
				signal?.removeEventListener('abort', abortHandler);
			};

			emitter.on(AgentEvent.StateChanged, stateChangedHandler);
			signal?.addEventListener('abort', abortHandler);
		});
	};

	const waitUntilCouldBeListening = async (signal?: AbortSignal) => {
		const { canListen } = generateDerivedStateValues(state);
		if (canListen) {
			return;
		}

		return new Promise<void>((resolve, reject) => {
			const stateChangedHandler = (newState: AgentState) => {
				const { canListen } = generateDerivedStateValues(newState);
				if (!canListen) {
					return;
				}
				cleanup();
				resolve();
			};
			const abortHandler = () => {
				cleanup();
				reject(new Error('useAgent(/* ... */).waitUntilCouldBeListening - signal aborted'));
			};

			const cleanup = () => {
				emitter.off(AgentEvent.StateChanged, stateChangedHandler);
				signal?.removeEventListener('abort', abortHandler);
			};

			emitter.on(AgentEvent.StateChanged, stateChangedHandler);
			signal?.addEventListener('abort', abortHandler);
		});
	};

	const waitUntilFinished = async (signal?: AbortSignal) => {
		const { isFinished } = generateDerivedStateValues(state);
		if (isFinished) {
			return;
		}

		return new Promise<void>((resolve, reject) => {
			const stateChangedHandler = (newState: AgentState) => {
				const { isFinished } = generateDerivedStateValues(newState);
				if (!isFinished) {
					return;
				}
				cleanup();
				resolve();
			};
			const abortHandler = () => {
				cleanup();
				reject(new Error('useAgent(/* ... */).waitUntilFinished - signal aborted'));
			};

			const cleanup = () => {
				emitter.off(AgentEvent.StateChanged, stateChangedHandler);
				signal?.removeEventListener('abort', abortHandler);
			};

			emitter.on(AgentEvent.StateChanged, stateChangedHandler);
			signal?.addEventListener('abort', abortHandler);
		});
	};

	const waitUntilCamera = async (signal?: AbortSignal) => {
		return new Promise<TrackReference>((resolve, reject) => {
			const stateChangedHandler = (camera: TrackReference | undefined) => {
				if (!camera) {
					return;
				}
				cleanup();
				resolve(camera);
			};
			const abortHandler = () => {
				cleanup();
				reject(new Error('useAgent(/* ... */).waitUntilCamera - signal aborted'));
			};

			const cleanup = () => {
				emitter.off(AgentEvent.CameraChanged, stateChangedHandler);
				signal?.removeEventListener('abort', abortHandler);
			};

			emitter.on(AgentEvent.CameraChanged, stateChangedHandler);
			signal?.addEventListener('abort', abortHandler);
		});
	};

	const waitUntilMicrophone = async (signal?: AbortSignal) => {
		return new Promise<TrackReference>((resolve, reject) => {
			const stateChangedHandler = (microphone: TrackReference | undefined) => {
				if (!microphone) {
					return;
				}
				cleanup();
				resolve(microphone);
			};
			const abortHandler = () => {
				cleanup();
				reject(new Error('useAgent(/* ... */).waitUntilMicrophone - signal aborted'));
			};

			const cleanup = () => {
				emitter.off(AgentEvent.MicrophoneChanged, stateChangedHandler);
				signal?.removeEventListener('abort', abortHandler);
			};

			emitter.on(AgentEvent.MicrophoneChanged, stateChangedHandler);
			signal?.addEventListener('abort', abortHandler);
		});
	};

	return {
		...agentState,
		waitUntilConnected,
		waitUntilCouldBeListening,
		waitUntilFinished,
		waitUntilCamera,
		waitUntilMicrophone
	};
}
