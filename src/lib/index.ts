// Components
export * from './components/index.js';

// Prefabs
export * from './prefabs/index.js';

// Hooks
export * from './hooks/index.js';

// Context
export * from './context/index.js';

// Assets
export * from './assets/index.js';

// Utils
export { isTrackReference, getTrackReferenceId, sortTrackReferences } from './utils.js';

// Re-export types from @livekit/components-core
export type {
	ChatMessage,
	ReceivedChatMessage,
	TrackReference,
	TrackReferenceOrPlaceholder,
	TrackReferencePlaceholder,
	ParticipantClickEvent,
	PinState,
	WidgetState,
	GridLayoutDefinition,
	GridLayoutInfo,
	TrackSourceWithOptions,
	SourcesArray,
	TrackReferenceFilter,
	ParticipantFilter,
	AudioSource,
	VideoSource,
	ToggleSource,
	CaptureOptionsBySource,
	ParticipantIdentifier,
	TrackIdentifier,
	ChatOptions,
	ReceivedDataMessage
} from '@livekit/components-core';

// Re-export utility functions from @livekit/components-core
export {
	isTrackReferencePlaceholder,
	isSourceWitOptions,
	isSourcesWithOptions,
	isTrackReferencePinned,
	log
} from '@livekit/components-core';

// Re-export types from livekit-client (excluding Room and Track which are exported as values below)
export type {
	Participant,
	LocalParticipant,
	RemoteParticipant,
	TrackPublication,
	LocalTrack,
	LocalTrackPublication,
	RemoteTrack,
	RemoteTrackPublication,
	ConnectionState,
	ConnectionQuality,
	RoomOptions,
	RoomConnectOptions,
	VideoCaptureOptions,
	AudioCaptureOptions,
	ScreenShareCaptureOptions
} from 'livekit-client';

// Re-export Room and Track classes for convenience (both type and value)
export { Room, Track } from 'livekit-client';
