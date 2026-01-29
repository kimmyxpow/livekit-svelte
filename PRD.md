# PRD: livekit-svelte

## Project Goal

Build Svelte replacement for `@livekit/components-react` with **100% API parity**

## Reference Implementation

All components, hooks, and utilities MUST match the exact API from:
`./.internal-agent/reference-only/react/`

---

# ✅ IMPLEMENTATION CHECKLIST

## 🔧 UTILITIES

### Core Utilities

- [ ] `mergeProps` - Merge props objects with event chaining, class combining, id deduplication
  - **Params**: `...args: Props[]`
  - **Return**: `UnionToIntersection<TupleTypes<T>>`
  - **Reference**: `./internal-agent/reference-only/react/src/mergeProps.ts`

- [ ] `chain` - Call all functions in order with same arguments
  - **Params**: `...callbacks: any[]`
  - **Return**: `(...args: any[]) => void`
  - **Reference**: `./internal-agent/reference-only/react/src/mergeProps.ts`

- [ ] `cloneSingleChild` - Clone single child element with merged props
  - **Params**: `children: React.ReactNode | React.ReactNode[]; props?: Record<string, any>; key?: any`
  - **Return**: `React.ReactNode`
  - **Reference**: `./internal-agent/reference-only/react/src/utils.ts`

- [ ] `warnAboutMissingStyles` - Warn if @livekit/components-styles is not imported
  - **Params**: `el?: HTMLElement`
  - **Return**: `void`
  - **Reference**: `./internal-agent/reference-only/react/src/utils.ts`

- [ ] `roomOptionsStringifyReplacer` - Stringify room options for dependency detection, replaces processors and e2ee options
  - **Params**: `key: string; val: unknown`
  - **Return**: `unknown`
  - **Reference**: `./internal-agent/reference-only/react/src/utils.ts`

---

## 🎨 ASSETS

### Icons

- [ ] `CameraIcon` - Camera on icon
  - **Reference**: `./internal-agent/reference-only/react/src/assets/icons/CameraIcon.tsx`

- [ ] `CameraDisabledIcon` - Camera off icon
  - **Reference**: `./internal-agent/reference-only/react/src/assets/icons/CameraDisabledIcon.tsx`

- [ ] `MicIcon` - Microphone on icon
  - **Reference**: `./internal-agent/reference-only/react/src/assets/icons/MicIcon.tsx`

- [ ] `MicDisabledIcon` - Microphone off icon
  - **Reference**: `./internal-agent/reference-only/react/src/assets/icons/MicDisabledIcon.tsx`

- [ ] `ScreenShareIcon` - Screen share start icon
  - **Reference**: `./internal-agent/reference-only/react/src/assets/icons/ScreenShareIcon.tsx`

- [ ] `ScreenShareStopIcon` - Screen share stop icon
  - **Reference**: `./internal-agent/reference-only/react/src/assets/icons/ScreenShareStopIcon.tsx`

- [ ] `QualityExcellentIcon` - Excellent connection quality icon
  - **Reference**: `./internal-agent/reference-only/react/src/assets/icons/QualityExcellentIcon.tsx`

- [ ] `QualityGoodIcon` - Good connection quality icon
  - **Reference**: `./internal-agent/reference-only/react/src/assets/icons/QualityGoodIcon.tsx`

- [ ] `QualityPoorIcon` - Poor connection quality icon
  - **Reference**: `./internal-agent/reference-only/react/src/assets/icons/QualityPoorIcon.tsx`

- [ ] `QualityUnknownIcon` - Unknown connection quality icon
  - **Reference**: `./internal-agent/reference-only/react/src/assets/icons/QualityUnknownIcon.tsx`

- [ ] `Chevron` - Chevron icon
  - **Reference**: `./internal-agent/reference-only/react/src/assets/icons/Chevron.tsx`

- [ ] `GearIcon` - Settings gear icon
  - **Reference**: `./internal-agent/reference-only/react/src/assets/icons/GearIcon.tsx`

- [ ] `LeaveIcon` - Leave/exit icon
  - **Reference**: `./internal-agent/reference-only/react/src/assets/icons/LeaveIcon.tsx`

- [ ] `ChatIcon` - Chat icon
  - **Reference**: `./internal-agent/reference-only/react/src/assets/icons/ChatIcon.tsx`

- [ ] `ChatCloseIcon` - Chat close icon
  - **Reference**: `./internal-agent/reference-only/react/src/assets/icons/ChatCloseIcon.tsx`

- [ ] `FocusToggleIcon` - Focus toggle on icon
  - **Reference**: `./internal-agent/reference-only/react/src/assets/icons/FocusToggleIcon.tsx`

- [ ] `UnfocusToggleIcon` - Focus toggle off icon
  - **Reference**: `./internal-agent/reference-only/react/src/assets/icons/UnfocusToggleIcon.tsx`

- [ ] `LockLockedIcon` - Lock icon (encryption)
  - **Reference**: `./internal-agent/reference-only/react/src/assets/icons/LockLockedIcon.tsx`

- [ ] `SpinnerIcon` - Loading spinner icon
  - **Reference**: `./internal-agent/reference-only/react/src/assets/icons/SpinnerIcon.tsx`

### Icon Utilities

- [ ] `getSourceIcon` - Helper function to get icon based on track source
  - **Params**: `source: Track.Source, enabled: boolean`
  - **Return**: React Element
  - **Reference**: `./internal-agent/reference-only/react/src/assets/icons/util.tsx`

- [ ] `getConnectionQualityIcon` - Helper function to get icon based on connection quality
  - **Params**: `quality: ConnectionQuality`
  - **Return**: React Element
  - **Reference**: `./internal-agent/reference-only/react/src/assets/icons/util.tsx`

### Images

- [ ] `ParticipantPlaceholder` - Placeholder image for participants without video
  - **Reference**: `./internal-agent/reference-only/react/src/assets/images/ParticipantPlaceholder.tsx`

---

## 📦 CONTEXTS

- [ ] `RoomContext` - Provides Room instance to child components
  - **Exports**: `RoomContext`, `useRoomContext`, `useMaybeRoomContext`, `useEnsureRoom`
  - **Reference**: `./internal-agent/reference-only/react/src/context/room-context.ts`

- [ ] `ParticipantContext` - Provides Participant instance to child components
  - **Exports**: `ParticipantContext`, `useEnsureParticipant`, `useMaybeParticipantContext`, `useParticipantContext`
  - **Reference**: `./internal-agent/reference-only/react/src/context/participant-context.ts`

- [ ] `TrackRefContext` - Provides TrackReference to child components
  - **Exports**: `TrackRefContext`, `useEnsureTrackRef`, `useMaybeTrackRefContext`, `useTrackRefContext`
  - **Reference**: `./internal-agent/reference-only/react/src/context/track-reference-context.ts`

- [ ] `LayoutContext` - Manages layout state (pinning, widgets)
  - **Exports**: `LayoutContext`, `useLayoutContext`, `useEnsureLayoutContext`, `useCreateLayoutContext`, `useEnsureCreateLayoutContext`, `useMaybeLayoutContext`, `LayoutContextType`
  - **Reference**: `./internal-agent/reference-only/react/src/context/layout-context.ts`

- [ ] `ChatContext` - Manages chat widget state
  - **Exports**: `WidgetContextType`, `ChatContextAction`, `chatReducer`
  - **Reference**: `./internal-agent/reference-only/react/src/context/chat-context.ts`

- [ ] `PinContext` - Manages pinned tracks state
  - **Exports**: `PinContextType`, `PinAction`, `pinReducer`
  - **Reference**: `./internal-agent/reference-only/react/src/context/pin-context.ts`

- [ ] `SessionContext` - Manages agent session state
  - **Exports**: `SessionContext`, `useEnsureSession`, `useMaybeSessionContext`, `useSessionContext`
  - **Reference**: `./internal-agent/reference-only/react/src/context/session-context.ts`

- [ ] `LKFeatureContext` - Manages feature flags
  - **Exports**: `FeatureFlags`, `LKFeatureContext`, `useFeatureContext`
  - **Reference**: `./internal-agent/reference-only/react/src/context/feature-context.ts`

---

## 🪢 HOOKS

### Core Room Hooks

- [ ] `useLiveKitRoom` - Core hook for implementing LiveKitRoom component functionality
  - **Params**: `props: LiveKitRoomProps`
  - **Return**: `{ room: Room | undefined, htmlProps: HTMLAttributes<T> }`
  - **Reference**: `./internal-agent/reference-only/react/src/hooks/useLiveKitRoom.ts`

- [ ] `useRoomInfo` - Get room name and metadata
  - **Params**: `options: UseRoomInfoOptions`
  - **Return**: `{ name: string | undefined, metadata: string | undefined }`
  - **Reference**: `./internal-agent/reference-only/react/src/hooks/useRoomInfo.ts`

- [ ] `useConnectionState` - Get connection state of the room
  - **Params**: `room?: Room`
  - **Return**: `ConnectionState`
  - **Reference**: `./internal-agent/reference-only/react/src/hooks/useConnectionStatus.ts`

### Participant Hooks

- [ ] `useLocalParticipant` - Get local participant state and track information
  - **Params**: `options: UseLocalParticipantOptions`
  - **Return**: `{ isMicrophoneEnabled: boolean, isCameraEnabled: boolean, isScreenShareEnabled: boolean, microphoneTrack: TrackPublication | undefined, cameraTrack: TrackPublication | undefined, lastMicrophoneError: any, lastCameraError: any, localParticipant: LocalParticipant }`
  - **Reference**: `./internal-agent/reference-only/react/src/hooks/useLocalParticipant.ts`

- [ ] `useParticipants` - Get all participants (local and remote)
  - **Params**: `options: UseParticipantsOptions`
  - **Return**: `Participant[]`
  - **Reference**: `./internal-agent/reference-only/react/src/hooks/useParticipants.ts`

- [ ] `useRemoteParticipants` - Get remote participants only
  - **Params**: `options: UseRemoteParticipantsOptions`
  - **Return**: `RemoteParticipant[]`
  - **Reference**: `./internal-agent/reference-only/react/src/hooks/useRemoteParticipants.ts`

- [ ] `useRemoteParticipant` - Get first remote participant by identity or kind
  - **Params**: `identityOrIdentifier: string | ParticipantIdentifier, options: UseRemoteParticipantOptions`
  - **Return**: `RemoteParticipant | undefined`
  - **Reference**: `./internal-agent/reference-only/react/src/hooks/useRemoteParticipant.ts`

- [ ] `useParticipantInfo` - Get participant identity, name, and metadata
  - **Params**: `props: UseParticipantInfoOptions`
  - **Return**: `{ identity: string | undefined, name: string | undefined, metadata: string | undefined }`
  - **Reference**: `./internal-agent/reference-only/react/src/hooks/useParticipantInfo.ts`

- [ ] `useParticipantPermissions` - Get participant permissions
  - **Params**: `options: UseParticipantPermissionsOptions`
  - **Return**: `ParticipantPermission | undefined`
  - **Reference**: `./internal-agent/reference-only/react/src/hooks/useParticipantPermissions.ts`

- [ ] `useParticipantAttributes` - Get participant attributes
  - **Params**: `props: UseParticipantAttributesOptions`
  - **Return**: `{ attributes: Participant['attributes'] }`
  - **Reference**: `./internal-agent/reference-only/react/src/hooks/useParticipantAttributes.ts`

- [ ] `useLocalParticipantPermissions` - Get local participant permissions
  - **Params**: none
  - **Return**: `ParticipantPermission | undefined`
  - **Reference**: `./internal-agent/reference-only/react/src/hooks/useLocalParticipantPermissions.ts`

- [ ] `useSortedParticipants` - Get participants sorted by importance
  - **Params**: `participants: Array<Participant>`
  - **Return**: `Participant[]`
  - **Reference**: `./internal-agent/reference-only/react/src/hooks/useSortedParticipants.ts`

- [ ] `useSpeakingParticipants` - Get active speakers
  - **Params**: `options: UseSpeakingParticipantsOptions`
  - **Return**: `RemoteParticipant[]`
  - **Reference**: `./internal-agent/reference-only/react/src/hooks/useSpeakingParticipants.ts`

- [ ] `useIsSpeaking` - Check if participant is speaking
  - **Params**: `participant: Participant | undefined`
  - **Return**: `boolean`
  - **Reference**: `./internal-agent/reference-only/react/src/hooks/useIsSpeaking.ts`

### Track Hooks

- [ ] `useTracks` - Get track references for specified sources
  - **Params**: `sources: T, options: UseTracksOptions`
  - **Return**: `UseTracksHookReturnType<T>`
  - **Reference**: `./internal-agent/reference-only/react/src/hooks/useTracks.ts`

- [ ] `useTrackByName` - Get a specific track by name
  - **Params**: `name: string, participant: Participant | undefined`
  - **Return**: `TrackReferenceOrPlaceholder`
  - **Reference**: `./internal-agent/reference-only/react/src/hooks/useTrackByName.ts`

- [ ] `useTrackVolume` - Get volume level of an audio track
  - **Params**: `trackOrTrackReference: LocalAudioTrack | RemoteAudioTrack | TrackReference | undefined, options: AudioAnalyserOptions`
  - **Return**: `number` (0-1)
  - **Reference**: `./internal-agent/reference-only/react/src/hooks/useTrackVolume.ts`

- [ ] `useParticipantTracks` - Get tracks of a specific participant only
  - **Params**: `sources: Array<TrackSource>, optionsOrParticipantIdentity: UseParticipantTracksOptions | string`
  - **Return**: `Array<TrackReference>`
  - **Reference**: `./internal-agent/reference-only/react/src/hooks/useParticipantTracks.ts`

- [ ] `useTrackMutedIndicator` - Get muted state of a track
  - **Params**: `trackRef: TrackReferenceOrPlaceholder | undefined`
  - **Return**: `{ isMuted: boolean, className: string }`
  - **Reference**: `./internal-agent/reference-only/react/src/hooks/useTrackMutedIndicator.ts`

- [ ] `useIsMuted` - Check if tracks are muted
  - **Params**: `trackRef: TrackReferenceOrPlaceholder, options: UseIsMutedOptions`
  - **Return**: `boolean`
  - **Reference**: `./internal-agent/reference-only/react/src/hooks/useIsMuted.ts`

- [ ] `useTrackTranscription` - Get transcription segments for a track
  - **Params**: `trackRef: TrackReferenceOrPlaceholder | undefined, options: TrackTranscriptionOptions`
  - **Return**: `{ segments: Array<ReceivedTranscriptionSegment> }`
  - **Reference**: `./internal-agent/reference-only/react/src/hooks/useTrackTranscription.ts`

- [ ] `useTrackToggle` - Toggle track publication/subscription
  - **Params**: `source: T, onChange?: (enabled: boolean, userInteraction: boolean) => void, initialState?: boolean, captureOptions?: TrackCaptureOptions | undefined, publishOptions?: TrackPublishOptions | undefined, onDeviceError?: (e: Error) | undefined, room?: Room | undefined`
  - **Return**: `{ toggle: () => Promise<void>, enabled: boolean, pending: boolean, track: TrackPublication | undefined, buttonProps: React.ButtonHTMLAttributes<HTMLButtonElement> }`
  - **Reference**: `./internal-agent/reference-only/react/src/hooks/useTrackToggle.ts`

### Media Device Hooks

- [ ] `useMediaDevices` - Get list of media devices of a specific kind
  - **Params**: `kind: MediaDeviceKind, onError?: (e: Error) => void`
  - **Return**: `MediaDeviceInfo[]`
  - **Reference**: `./internal-agent/reference-only/react/src/hooks/useMediaDevices.ts`

- [ ] `useMediaDeviceSelect` - Handle media device selection and management
  - **Params**: `kind: MediaDeviceKind, room: Room | undefined, track: LocalAudioTrack | LocalVideoTrack | undefined, requestPermissions: boolean | undefined, onError?: (e: Error) => void`
  - **Return**: `{ devices: MediaDeviceInfo[], className: string, activeDeviceId: string, setActiveMediaDevice: (deviceId: string) => void }`
  - **Reference**: `./internal-agent/reference-only/react/src/hooks/useMediaDeviceSelect.ts`

- [ ] `useFacingMode` - Determine facing mode of local participant video track
  - **Params**: `trackReference: TrackReferenceOrPlaceholder`
  - **Return**: `'user' | 'environment' | 'left' | 'right' | 'undefined'`
  - **Reference**: `./internal-agent/reference-only/react/src/hooks/useFacingMode.ts`

### State and Status Hooks

- [ ] `useIsEncrypted` - Check if room is encrypted
  - **Params**: `participant: Participant | undefined, options: UseIsEncryptedOptions`
  - **Return**: `boolean`
  - **Reference**: `./internal-agent/reference-only/react/src/hooks/useIsEncrypted.ts`

- [ ] `useIsRecording` - Check if room is being recorded
  - **Params**: `room: Room | undefined`
  - **Return**: `boolean`
  - **Reference**: `./internal-agent/reference-only/react/src/hooks/useIsRecording.ts`

- [ ] `useConnectionQualityIndicator` - Get connection quality indicator props
  - **Params**: `options: ConnectionQualityIndicatorOptions`
  - **Return**: `{ className: string, quality: ConnectionQuality }`
  - **Reference**: `./internal-agent/reference-only/react/src/hooks/useConnectionQualityIndicator.ts`

### Chat and Communication Hooks

- [ ] `useChat` - Handle chat functionality in a room
  - **Params**: `options: (ChatOptions & { room?: Room }) | undefined`
  - **Return**: `{ chatMessages: ReceivedChatMessage[], send: (message: string, options?: ChatOptions) => Promise<ReceivedChatMessage>, isSending: boolean }`
  - **Reference**: `./internal-agent/reference-only/react/src/hooks/useChat.ts`

- [ ] `useDataChannel` - Handle data channel communication
  - **Params**: `topic: T, onMessage: (msg: ReceivedDataMessage<T>) => void | undefined`
  - **Return**: `UseDataChannelReturnType<T>`
  - **Reference**: `./internal-agent/reference-only/react/src/hooks/useDataChannel.ts`

- [ ] `useTextStream` - Get text streams from a specific topic
  - **Params**: `topic: string, options: UseTextStreamOptions`
  - **Return**: `{ textStreams: TextStreamData[] }`
  - **Reference**: `./internal-agent/reference-only/react/src/hooks/useTextStream.ts`

- [ ] `useTranscriptions` - Get transcriptions for participant identities and track sids
  - **Params**: `opts: UseTranscriptionsOptions`
  - **Return**: `Array<TextStreamData>`
  - **Reference**: `./internal-agent/reference-only/react/src/hooks/useTranscriptions.ts`

### AI Agent Hooks

- [ ] `useAgent` - Manage AI agent state and lifecycle
  - **Params**: `session: SessionStub`
  - **Return**: `UseAgentReturn`
  - **Reference**: `./internal-agent/reference-only/react/src/hooks/useAgent.ts`

- [ ] `useVoiceAssistant` - Find first agent-participant in the room
  - **Params**: none
  - **Return**: `VoiceAssistant`
  - **Reference**: `./internal-agent/reference-only/react/src/hooks/useVoiceAssistant.ts`

- [ ] `useSession` - Managed connection to a Room which can contain Agents
  - **Params**: `tokenSource: TokenSourceConfigurable | TokenSourceFixed, options: UseSessionConfigurableOptions | UseSessionFixedOptions`
  - **Return**: `UseSessionReturn`
  - **Reference**: `./internal-agent/reference-only/react/src/hooks/useSession.ts`

- [ ] `useSessionMessages` - Manage messages from chat and transcriptions in a session
  - **Params**: `session: UseSessionReturn`
  - **Return**: `UseSessionMessagesReturn`
  - **Reference**: `./internal-agent/reference-only/react/src/hooks/useSessionMessages.ts`

- [ ] `useSequentialRoomConnectDisconnect` - Sequentialize room connection and disconnection operations
  - **Params**: `room: Room | undefined`
  - **Return**: `UseSequentialRoomConnectDisconnectResults<R>`
  - **Reference**: `./internal-agent/reference-only/react/src/hooks/useSequentialRoomConnectDisconnect.ts`

### Layout and UI Hooks

- [ ] `useGridLayout` - Handle grid layout for participants
  - **Params**: `gridElement: React.RefObject<HTMLDivElement>, trackCount: number, options: { gridLayouts?: GridLayoutDefinition[] }`
  - **Return**: `{ layout: GridLayoutInfo, containerWidth: number, containerHeight: number }`
  - **Reference**: `./internal-agent/reference-only/react/src/hooks/useGridLayout.ts`

- [ ] `usePagination` - Implement pagination logic for arrays
  - **Params**: `itemPerPage: number, trackReferences: TrackReferenceOrPlaceholder[]`
  - **Return**: `{ totalPageCount: number, nextPage: () => void, prevPage: () => void, setPage: (num: number) => void, firstItemIndex: number, lastItemIndex: number, tracks: TrackReferenceOrPlaceholder[], currentPage: number }`
  - **Reference**: `./internal-agent/reference-only/react/src/hooks/usePagination.ts`

- [ ] `useVisualStableUpdate` - Prevent visually jarring jumps and shifts of elements in an array
  - **Params**: `trackReferences: TrackReferenceOrPlaceholder[], maxItemsOnPage: number, options: UseVisualStableUpdateOptions`
  - **Return**: `TrackReferenceOrPlaceholder[]`
  - **Reference**: `./internal-agent/reference-only/react/src/hooks/useVisualStableUpdate.ts`

- [ ] `useFocusToggle` - Handle participant focus functionality
  - **Params**: `props: UseFocusToggleProps`
  - **Return**: `{ mergedProps: React.ButtonHTMLAttributes<HTMLButtonElement>, inFocus: boolean }`
  - **Reference**: `./internal-agent/reference-only/react/src/hooks/useFocusToggle.ts`

- [ ] `usePinnedTracks` - Get pinned tracks of the current room
  - **Params**: `layoutContext: LayoutContextType | undefined`
  - **Return**: `TrackReferenceOrPlaceholder[]`
  - **Reference**: `./internal-agent/reference-only/react/src/hooks/usePinnedTracks.ts`

- [ ] `useSwipe` - Detect horizontal swipe actions on touch devices
  - **Params**: `element: React.RefObject<HTMLElement>, options: UseSwipeOptions`
  - **Return**: `void`
  - **Reference**: `./internal-agent/reference-only/react/src/hooks/useSwipe.ts`

### Component Hooks (for implementing components)

- [ ] `useParticipantTile` - Provide props for implementing ParticipantTile component
  - **Params**: `trackRef: TrackReferenceOrPlaceholder | undefined, onParticipantClick: (event: ParticipantClickEvent) => void | undefined, disableSpeakingIndicator: boolean | undefined, htmlProps: React.HTMLAttributes<T>`
  - **Return**: `{ elementProps: React.HTMLAttributes<T> }`
  - **Reference**: `./internal-agent/reference-only/react/src/hooks/useParticipantTile.ts`

- [ ] `useDisconnectButton` - Provide props for implementing disconnect button
  - **Params**: `props: DisconnectButtonProps`
  - **Return**: `{ buttonProps: DisconnectButtonProps }`
  - **Reference**: `./internal-agent/reference-only/react/src/hooks/useDisconnectButton.ts`

- [ ] `useClearPinButton` - Provide props for implementing clear pin button
  - **Params**: `props: ClearPinButtonProps`
  - **Return**: `{ buttonProps: ClearPinButtonProps }`
  - **Reference**: `./internal-agent/reference-only/react/src/hooks/useClearPinButton.ts`

- [ ] `useChatToggle` - Provide state and functions for toggling chat window
  - **Params**: `props: UseChatToggleProps`
  - **Return**: `{ mergedProps: React.ButtonHTMLAttributes<HTMLButtonElement> }`
  - **Reference**: `./internal-agent/reference-only/react/src/hooks/useChatToggle.ts`

- [ ] `useSettingsToggle` - Provide state and functions for toggling settings menu
  - **Params**: `props: React.ButtonHTMLAttributes<HTMLButtonElement>`
  - **Return**: `{ mergedProps: React.ButtonHTMLAttributes<HTMLButtonElement> }`
  - **Reference**: `./internal-agent/reference-only/react/src/hooks/useSettingsToggle.ts`

- [ ] `useStartAudio` - Manage audio playback permissions
  - **Params**: `room: Room | undefined, props: React.ButtonHTMLAttributes<HTMLButtonElement>`
  - **Return**: `{ mergedProps: React.ButtonHTMLAttributes<HTMLButtonElement>, canPlayAudio: boolean }`
  - **Reference**: `./internal-agent/reference-only/react/src/hooks/useStartAudio.ts`

- [ ] `useStartVideo` - Manage video playback permissions
  - **Params**: `room: Room | undefined, props: React.ButtonHTMLAttributes<HTMLButtonElement>`
  - **Return**: `{ mergedProps: React.ButtonHTMLAttributes<HTMLButtonElement>, canPlayVideo: boolean }`
  - **Reference**: `./internal-agent/reference-only/react/src/hooks/useStartVideo.ts`

- [ ] `useAudioPlayback` - Manage audio playback permissions
  - **Params**: `room: Room | undefined`
  - **Return**: `{ canPlayAudio: boolean, startAudio: () => Promise<void> }`
  - **Reference**: `./internal-agent/reference-only/react/src/hooks/useAudioPlayback.ts`

### Utility Hooks

- [ ] `useToken` - Fetch token from token endpoint
  - **Params**: `tokenEndpoint: string | undefined, roomName: string, options: UseTokenOptions`
  - **Return**: `string | undefined`
  - **Reference**: `./internal-agent/reference-only/react/src/hooks/useToken.ts`

- [ ] `usePersistentUserChoices` - Access user choices stored in local storage
  - **Params**: `options: UsePersistentUserChoicesOptions`
  - **Return**: `{ userChoices: LocalUserChoices, saveAudioInputEnabled: (isEnabled: boolean) => void, saveVideoInputEnabled: (isEnabled: boolean) => void, saveAudioInputDeviceId: (deviceId: string) => void, saveVideoInputDeviceId: (deviceId: string) => void, saveUsername: (username: string) => void }`
  - **Reference**: `./internal-agent/reference-only/react/src/hooks/usePersistentUserChoices.ts`

- [ ] `useWarnAboutMissingStyles` - Warn about missing LiveKit styles
  - **Params**: `el?: HTMLElement`
  - **Return**: `void`
  - **Reference**: `./internal-agent/reference-only/react/src/hooks/useWarnAboutMissingStyles.ts`

- [ ] `useEvents` - Manage event subscription for typed event emitters
  - **Params**: `instance: Emitter | { internal: { emitter: Emitter } } | null | undefined, event: Event, handlerFn: Callback | undefined, dependencies: React.DependencyList`
  - **Return**: `void`
  - **Reference**: `./internal-agent/reference-only/react/src/hooks/useEvents.ts`

### Internal Hooks

- [ ] `useObservableState` - Subscribe to observables and update state
  - **Params**: `observable: Observable<T> | undefined, startWith: T, resetWhenObservableChanges?: boolean`
  - **Return**: `T`
  - **Reference**: `./internal-agent/reference-only/react/src/hooks/internal/useObservableState.ts`

- [ ] `useMediaQuery` - Monitor CSS media query matches
  - **Params**: `query: string`
  - **Return**: `boolean`
  - **Reference**: `./internal-agent/reference-only/react/src/hooks/internal/useMediaQuery.ts`

- [ ] `useResizeObserver` - Monitor element size changes
  - **Params**: `target: React.RefObject<T>, callback: UseResizeObserverCallback`
  - **Return**: `ResizeObserver`
  - **Reference**: `./internal-agent/reference-only/react/src/hooks/internal/useResizeObserver.ts`

- [ ] `useTrackRefBySourceOrName` - INTERNAL: Get track reference by source or name
  - **Params**: `source: TrackSource<Track.Source>`
  - **Return**: `TrackReferenceOrPlaceholder`
  - **Reference**: `./internal-agent/reference-only/react/src/hooks/useTrackRefBySourceOrName.ts`

- [ ] `useMediaTrackBySourceOrName` - INTERNAL: Get media track by source or name
  - **Params**: `observerOptions: TrackIdentifier, options: UseMediaTrackOptions = {}`
  - **Return**: `{ publication, isMuted, isSubscribed, track, elementProps }`
  - **Reference**: `./internal-agent/reference-only/react/src/hooks/useMediaTrackBySourceOrName.ts`

- [ ] `useTrackSyncTime` - INTERNAL: Get track sync time (deprecated)
  - **Params**: `ref: TrackReferenceOrPlaceholder | undefined`
  - **Return**: `{ timestamp, rtpTimestamp }`
  - **Reference**: `./internal-agent/reference-only/react/src/hooks/useTrackSyncTime.ts`

### Cloud Hooks

- [ ] `useKrispNoiseFilter` - Apply Krisp noise filtering to audio track
  - **Params**: `track: LocalAudioTrack | undefined`
  - **Return**: `void`
  - **Reference**: `./internal-agent/reference-only/react/src/hooks/cloud/krisp/useKrispNoiseFilter.ts`

---

## 🎩 COMPONENTS

### Core Room Components

- [ ] `LiveKitRoom` - Root component providing room context to children
  - **Params**: `serverUrl: string | undefined, token: string | undefined, audio?: AudioCaptureOptions | boolean, video?: VideoCaptureOptions | boolean, screen?: ScreenShareCaptureOptions | boolean, connect?: boolean, options?: RoomOptions, connectOptions?: RoomConnectOptions, onConnected?: () => void, onDisconnected?: (reason?: DisconnectReason) => void, onError?: (error: Error) => void, onMediaDeviceFailure?: (failure?: MediaDeviceFailure, kind?: MediaDeviceKind) => void, onEncryptionError?: (error: Error) => void, room?: Room, simulateParticipants?: number | undefined, featureFlags?: FeatureFlags`
  - **Output**: Provides RoomContext and LKFeatureContext, manages LiveKit room connection
  - **Reference**: `./internal-agent/reference-only/react/src/components/LiveKitRoom.tsx`

- [ ] `SessionProvider` - Provides session context and room context to children
  - **Params**: `session: UseSessionReturn, children: React.ReactNode`
  - **Output**: Provides SessionContext and RoomContext to child components
  - **Reference**: `./internal-agent/reference-only/react/src/components/SessionProvider.tsx`

- [ ] `ConnectionState` - Display connection status of the LiveKit room
  - **Params**: `room?: Room`
  - **Output**: Renders div containing connection state string ('connected' | 'connecting' | 'disconnected' | 'reconnecting')
  - **Reference**: `./internal-agent/reference-only/react/src/components/ConnectionState.tsx`

- [ ] `RoomAudioRenderer` - Drop-in solution for handling remote participants' audio tracks
  - **Params**: `room?: Room, volume?: number, muted?: boolean`
  - **Output**: Renders hidden divs with AudioTrack components for microphone, screen share audio, and unknown audio tracks
  - **Reference**: `./internal-agent/reference-only/react/src/components/RoomAudioRenderer.tsx`

- [ ] `RoomName` - Render the name of the connected LiveKit room
  - **Params**: `childrenPosition?: 'before' | 'after'`
  - **Output**: Renders span containing room name with optional children before/after
  - **Reference**: `./internal-agent/reference-only/react/src/components/RoomName.tsx`

### Layout Components

- [ ] `ParticipantLoop` - Loop over participants to create context for each
  - **Params**: `participants: Participant[], children: React.ReactNode`
  - **Output**: Creates ParticipantContext.Provider for each participant and renders child component within each context
  - **Reference**: `./internal-agent/reference-only/react/src/components/ParticipantLoop.tsx`

- [ ] `TrackLoop` - Loop over tracks to create context for each
  - **Params**: `tracks: TrackReference[] | TrackReferenceOrPlaceholder[], children: React.ReactNode`
  - **Output**: Creates TrackRefContext.Provider for each track and renders child component within each context
  - **Reference**: `./internal-agent/reference-only/react/src/components/TrackLoop.tsx`

- [ ] `GridLayout` - Grid layout for participants with pagination support
  - **Params**: `children: React.ReactNode, tracks: TrackReferenceOrPlaceholder[], updateOnlyOn?: RoomEvent[]`
  - **Output**: Renders grid of participants with pagination controls when overflow occurs
  - **Reference**: `./internal-agent/reference-only/react/src/components/layout/GridLayout.tsx`

- [ ] `FocusLayout` - Layout for displaying a single focused participant
  - **Params**: `trackRef?: TrackReferenceOrPlaceholder, onParticipantClick?: (evt: ParticipantClickEvent) => void`
  - **Output**: Renders ParticipantTile for a single focused participant
  - **Reference**: `./internal-agent/reference-only/react/src/components/layout/FocusLayout.tsx`

- [ ] `FocusLayoutContainer` - Container component for focus layout with side component
  - **Params**: none
  - **Output**: Renders div with 'lk-focus-layout' class containing children
  - **Reference**: `./internal-agent/reference-only/react/src/components/layout/FocusLayout.tsx`

- [ ] `CarouselLayout` - Display tracks in a scrollable container with automatic orientation
  - **Params**: `tracks: TrackReferenceOrPlaceholder[], children: React.ReactNode, orientation?: 'vertical' | 'horizontal'`
  - **Output**: Renders scrollable container with TrackLoop that displays as many tiles as fit
  - **Reference**: `./internal-agent/reference-only/react/src/components/layout/CarouselLayout.tsx`

- [ ] `LayoutContextProvider` - Provide layout context for managing pin and widget states
  - **Params**: `value?: LayoutContextType, onPinChange?: (state: PinState) => void, onWidgetChange?: (state: WidgetState) => void`
  - **Output**: Provides LayoutContext and handles pin/widget state changes
  - **Reference**: `./internal-agent/reference-only/react/src/components/layout/LayoutContextProvider.tsx`

### Participant Components

- [ ] `ParticipantTile` - Base wrapper for displaying visual representation of participants
  - **Params**: `trackRef?: TrackReferenceOrPlaceholder, disableSpeakingIndicator?: boolean, onParticipantClick?: (event: ParticipantClickEvent) => void`
  - **Output**: Renders VideoTrack/AudioTrack, participant metadata, placeholders, and focus toggle
  - **Reference**: `./internal-agent/reference-only/react/src/components/participant/ParticipantTile.tsx`

- [ ] `ParticipantAudioTile` - Base utility wrapper for displaying participant audio with visual indicators
  - **Params**: `trackRef?: TrackReferenceOrPlaceholder, disableSpeakingIndicator?: boolean, onParticipantClick?: (event: ParticipantClickEvent) => void`
  - **Output**: Renders AudioTrack, BarVisualizer, track muted indicator, participant name, and connection quality indicator
  - **Reference**: `./internal-agent/reference-only/react/src/components/participant/ParticipantAudioTile.tsx`

- [ ] `ParticipantName` - Display participant name or identity
  - **Params**: `participant?: Participant`
  - **Output**: Renders span containing participant name (or identity if name not available) with optional children
  - **Reference**: `./internal-agent/reference-only/react/src/components/participant/ParticipantName.tsx`

- [ ] `ConnectionQualityIndicator` - Show individual participant connection quality
  - **Params**: `participant?: Participant`
  - **Output**: Renders quality icon or custom children based on connection quality
  - **Reference**: `./internal-agent/reference-only/react/src/components/participant/ConnectionQualityIndicator.tsx`

- [ ] `TrackMutedIndicator` - Show whether participant's camera/microphone is muted
  - **Params**: `trackRef: TrackReferenceOrPlaceholder, show?: 'always' | 'muted' | 'unmuted'`
  - **Output**: Renders muted/unmuted icon based on track state and show prop
  - **Reference**: `./internal-agent/reference-only/react/src/components/participant/TrackMutedIndicator.tsx`

- [ ] `AudioTrack` - Render participant audio tracks
  - **Params**: `trackRef?: TrackReference, onSubscriptionStatusChanged?: (subscribed: boolean) => void, volume?: number, muted?: boolean`
  - **Output**: Renders audio element with volume and mute controls for remote audio tracks
  - **Reference**: `./internal-agent/reference-only/react/src/components/participant/AudioTrack.tsx`

- [ ] `VideoTrack` - Render participant video tracks
  - **Params**: `trackRef?: TrackReference, onTrackClick?: (evt: ParticipantClickEvent) => void, onSubscriptionStatusChanged?: (subscribed: boolean) => void, manageSubscription?: boolean`
  - **Output**: Renders video element with auto-subscription management based on intersection
  - **Reference**: `./internal-agent/reference-only/react/src/components/participant/VideoTrack.tsx`

- [ ] `AudioVisualizer` - Visualize audio volume as SVG bars (deprecated)
  - **Params**: `trackRef?: TrackReference`
  - **Output**: Renders SVG with animated bars showing audio volume levels
  - **Reference**: `./internal-agent/reference-only/react/src/components/participant/AudioVisualizer.tsx`

- [ ] `BarVisualizer` - Visualize audio signals as bars with voice assistant state transitions
  - **Params**: `state?: AgentState, barCount?: number, trackRef?: TrackReferenceOrPlaceholder, track?: TrackReferenceOrPlaceholder | LocalAudioTrack | RemoteAudioTrack, options?: BarVisualizerOptions`
  - **Output**: Renders div with audio bars that animate based on volume and voice assistant state
  - **Reference**: `./internal-agent/reference-only/react/src/components/participant/BarVisualizer.tsx`

### Control Components

- [ ] `TrackToggle` - Toggle button for enabling/disabling camera and microphone
  - **Params**: `source: T, showIcon?: boolean, initialState?: boolean, onChange?: (enabled: boolean, isUserInitiated: boolean) => void, captureOptions?: CaptureOptionsBySource<T>, publishOptions?: TrackPublishOptions, onDeviceError?: (error: Error) => void`
  - **Output**: Renders button with track source icon that toggles track state
  - **Reference**: `./internal-agent/reference-only/react/src/components/controls/TrackToggle.tsx`

- [ ] `DisconnectButton` - Button to disconnect from LiveKit room
  - **Params**: `stopTracks?: boolean`
  - **Output**: Renders button that disconnects from the room when clicked
  - **Reference**: `./internal-agent/reference-only/react/src/components/controls/DisconnectButton.tsx`

- [ ] `MediaDeviceSelect` - List of media devices with selection capability
  - **Params**: `kind: MediaDeviceKind, onActiveDeviceChange?: (deviceId: string) => void, onDeviceListChange?: (devices: MediaDeviceInfo[]) => void, onDeviceSelectError?: (e: Error) => void, initialSelection?: string, exactMatch?: boolean, track?: LocalAudioTrack | LocalVideoTrack, requestPermissions?: boolean, onError?: (e: Error) => void`
  - **Output**: Renders ul list of media devices with buttons to select active device
  - **Reference**: `./internal-agent/reference-only/react/src/components/controls/MediaDeviceSelect.tsx`

- [ ] `ChatToggle` - Button that toggles visibility of chat component
  - **Params**: none
  - **Output**: Renders button that toggles chat visibility when clicked
  - **Reference**: `./internal-agent/reference-only/react/src/components/controls/ChatToggle.tsx`

- [ ] `FocusToggle` - Toggle for focusing/unfocusing participant tiles
  - **Params**: `trackRef?: TrackReferenceOrPlaceholder`
  - **Output**: Renders button with focus/unfocus icon that toggles participant focus
  - **Reference**: `./internal-agent/reference-only/react/src/components/controls/FocusToggle.tsx`

- [ ] `ClearPinButton` - Clear pinned view and return to grid layout
  - **Params**: none
  - **Output**: Renders button that clears pinned view and displays grid layout
  - **Reference**: `./internal-agent/reference-only/react/src/components/controls/ClearPinButton.tsx`

- [ ] `SettingsMenuToggle` - Button that toggles visibility of settings menu
  - **Params**: none
  - **Output**: Renders button that toggles settings menu visibility when clicked
  - **Reference**: `./internal-agent/reference-only/react/src/components/controls/SettingsMenuToggle.tsx`

- [ ] `StartAudio` - Button to bypass browser autoplay policies for audio
  - **Params**: `room?: Room, label: string`
  - **Output**: Renders button to start audio playback when browser blocks autoplay
  - **Reference**: `./internal-agent/reference-only/react/src/components/controls/StartAudio.tsx`

- [ ] `StartMediaButton` - Button to bypass browser autoplay policies for media
  - **Params**: `label?: string`
  - **Output**: Renders button to start media playback when browser blocks autoplay
  - **Reference**: `./internal-agent/reference-only/react/src/components/controls/StartMediaButton.tsx`

- [ ] `PaginationControl` - Controls for navigating between pagination pages
  - **Params**: `totalPageCount: number, nextPage: () => void, prevPage: () => void, currentPage: number, pagesContainer?: React.RefObject<HTMLElement>`
  - **Output**: Renders navigation buttons and page count indicator with interaction-based visibility
  - **Reference**: `./internal-agent/reference-only/react/src/components/controls/PaginationControl.tsx`

- [ ] `PaginationIndicator` - Visual indicator showing current pagination position
  - **Params**: `totalPageCount: number, currentPage: number`
  - **Output**: Renders div with bubble indicators showing current page position
  - **Reference**: `./internal-agent/reference-only/react/src/components/controls/PaginationIndicator.tsx`

### UI Components

- [ ] `ChatEntry` - Display individual chat messages
  - **Params**: `entry: ReceivedChatMessage, hideName?: boolean, hideTimestamp?: boolean, messageFormatter?: MessageFormatter`
  - **Output**: Renders li element containing participant name, timestamp, formatted message, and attached images
  - **Reference**: `./internal-agent/reference-only/react/src/components/ChatEntry.tsx`

- [ ] `formatChatMessageLinks` - Format links in chat messages
  - **Params**: `message: string`
  - **Return**: `string`
  - **Reference**: `./internal-agent/reference-only/react/src/components/ChatEntry.tsx`

- [ ] `Toast` - Display short-lived messages to the user
  - **Params**: none
  - **Output**: Renders div with 'lk-toast' class containing children
  - **Reference**: `./internal-agent/reference-only/react/src/components/Toast.tsx`

- [ ] `ConnectionStateToast` - Display connection state toast notifications
  - **Params**: `room?: Room`
  - **Output**: Renders Toast component with spinner and connection state text when connecting/reconnecting/disconnected
  - **Reference**: `./internal-agent/reference-only/react/src/components/ConnectionStateToast.tsx`

---

## 🏗️ PREFABS

- [ ] `VideoConference` - Complete video conferencing app with grid/focus layouts, screen sharing, and chat
  - **Params**: `chatMessageFormatter?: MessageFormatter, chatMessageEncoder?: MessageEncoder, chatMessageDecoder?: MessageDecoder, SettingsComponent?: React.ComponentType`
  - **Output**: Dynamic layout switching between grid and focus views, auto-focus on screen share tracks, integrates ControlBar and Chat widgets, handles track pinning, shows ConnectionStateToast, includes RoomAudioRenderer
  - **Reference**: `./internal-agent/reference-only/react/src/prefabs/VideoConference.tsx`

- [ ] `AudioConference` - Default setup for classic audio conferencing app with participant grid/focus view switching
  - **Params**: none
  - **Output**: Provides audio participant tiles using TrackLoop with ParticipantAudioTile, includes ControlBar with mic/screenShare/camera/chat controls, integrates Chat widget based on state, uses LayoutContextProvider for widget state management
  - **Reference**: `./internal-agent/reference-only/react/src/prefabs/AudioConference.tsx`

- [ ] `ControlBar` - Media device control interface with customizable control options
  - **Params**: `controls?: ControlBarControls, variation?: 'minimal' | 'verbose' | 'textOnly', saveUserChoices?: boolean, onDeviceError?: (error: { source: Track.Source, error: Error }) => void`
  - **Output**: Renders control bar with mic/camera/screenShare/chat/settings/leave controls, includes MediaDeviceMenus for device selection, adapts UI based on screen space and permissions, persists user device choices, starts media if not connected
  - **Reference**: `./internal-agent/reference-only/react/src/prefabs/ControlBar.tsx`

- [ ] `Chat` - Real-time chat functionality for LiveKit rooms with message formatting
  - **Params**: `messageFormatter?: MessageFormatter, messageEncoder?: MessageEncoder, messageDecoder?: MessageDecoder, channelTopic?: any`
  - **Output**: Renders chat interface with header, message list, and input form; handles sending/receiving messages in real-time, manages unread message counts, auto-scrolls to latest messages, supports custom message formatting
  - **Reference**: `./internal-agent/reference-only/react/src/prefabs/Chat.tsx`

- [ ] `MediaDeviceMenu` - Dropdown menu for selecting audio/video input devices
  - **Params**: `kind?: MediaDeviceKind, initialSelection?: string, onActiveDeviceChange?: (kind: MediaDeviceKind, deviceId: string) => void, tracks?: Partial<Record<MediaDeviceKind, LocalAudioTrack | LocalVideoTrack | undefined>>, requestPermissions?: boolean`
  - **Output**: Renders button that opens device selection menu, lists available audio/video devices, handles device switching with permission requests, computes menu position, closes menu on click outside
  - **Reference**: `./internal-agent/reference-only/react/src/prefabs/MediaDeviceMenu.tsx`

- [ ] `PreJoin` - Pre-room join interface for selecting devices and username before entering a room
  - **Params**: `onSubmit?: (values: LocalUserChoices) => void, onValidate?: (values: LocalUserChoices) => boolean, onError?: (error: Error) => void, defaults?: Partial<LocalUserChoices>, debug?: boolean, joinLabel?: string, micLabel?: string, camLabel?: string, userLabel?: string, persistUserChoices?: boolean, videoProcessor?: TrackProcessor<Track.Kind.Video>`
  - **Output**: Shows video preview with device selection, audio/video toggles with device menus, username input field, validation before submission, persists user choices, debug mode for viewing choices
  - **Reference**: `./internal-agent/reference-only/react/src/prefabs/PreJoin.tsx`

- [ ] `usePreviewDevice` - Hook for PreJoin preview device management
  - **Params**: (part of PreJoin implementation)
  - **Return**: Preview device state
  - **Reference**: `./internal-agent/reference-only/react/src/prefabs/PreJoin.tsx`

- [ ] `usePreviewTracks` - Hook for PreJoin preview track management
  - **Params**: (part of PreJoin implementation)
  - **Return**: Preview tracks state
  - **Reference**: `./internal-agent/reference-only/react/src/prefabs/PreJoin.tsx`

- [ ] `VoiceAssistantControlBar` - Specialized control bar for voice assistant applications with audio visualization
  - **Params**: `controls?: VoiceAssistantControlBarControls, saveUserChoices?: boolean, onDeviceError?: (error: { source: Track.Source, error: Error }) => void`
  - **Output**: Renders microphone control with BarVisualizer audio visualization, audio device menu selection, disconnect button, starts media if not connected, persists user audio choices
  - **Reference**: `./internal-agent/reference-only/react/src/prefabs/VoiceAssistantControlBar.tsx`

---

## 🎬 ANIMATION UTILITIES

- [ ] `useBarAnimator` - Create animated bar visualizations based on agent state
  - **Params**: `state: AgentState | undefined, columns: number, interval: number`
  - **Return**: `number[]`
  - **Reference**: `./internal-agent/reference-only/react/src/components/participant/animators/useBarAnimator.ts`

- [ ] `generateConnectingSequenceBar` - Create bar animation sequence for connecting state
  - **Params**: `step: number`
  - **Return**: `number`
  - **Reference**: `./internal-agent/reference-only/react/src/components/participant/animationSequences/connectingSequence.ts`

- [ ] `generateListeningSequenceBar` - Create bar animation sequence for listening state
  - **Params**: `step: number`
  - **Return**: `number`
  - **Reference**: `./internal-agent/reference-only/react/src/components/participant/animationSequences/listeningSequence.ts`

- [ ] `generateThinkingSequenceBar` - Create bar animation sequence for thinking state
  - **Params**: `step: number`
  - **Return**: `number`
  - **Reference**: `./internal-agent/reference-only/react/src/components/participant/animationSequences/thinkingSequence.ts`

---

## IMPLEMENTATION RULES

1. Implement **one component / hook / function at a time**
2. Before implementing:
   - Open the corresponding file in `./internal-agent/reference-only/react`
3. After implementation:
   - Verify API and behavior match exactly
   - Run `bunx @sveltejs/mcp svelte-autofixer <file.svelte>`
4. No implementation without a reference file
5. Maintain exact folder structure from `./internal-agent/reference-only/react`
6. All exports must match React implementation

## TYPESCRIPT RULES

- `strict: true`
- No `any`
- No unsafe type assertions
- Full end-to-end type safety
- DRY principle
- No dead code
- No circular dependencies
- `eslint-disable` is forbidden

## ABSOLUTE CONSTRAINTS

- No API differences
- No renamed params
- No reordered params
- No added or removed features
- No deprecated APIs
- 100% API parity with React implementation
