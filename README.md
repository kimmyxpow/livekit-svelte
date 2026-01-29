# livekit-svelte (unofficial)

A Svelte 5 SDK for building LiveKit real-time video and audio applications. Provides components, hooks, and prefabs for video conferencing, live streaming, and AI voice assistant interfaces.

## Installation

```bash
bun add livekit-svelte livekit-client
```

## Quick Start

```svelte
<script>
	import { LiveKitRoom, VideoConference } from 'livekit-svelte';

	const token = 'your-access-token';
	const serverUrl = 'wss://your-livekit-server.com';
</script>

<LiveKitRoom {token} {serverUrl} connect={true}>
	<VideoConference />
</LiveKitRoom>
```

## Components

### Core Components

| Component              | Description                                              |
| ---------------------- | -------------------------------------------------------- |
| `LiveKitRoom`          | Root component that manages connection to a LiveKit room |
| `ParticipantLoop`      | Loop through all participants in the room                |
| `TrackLoop`            | Loop through tracks for a participant                    |
| `RoomAudioRenderer`    | Handles audio rendering for the room                     |
| `ConnectionState`      | Display connection status                                |
| `ConnectionStateToast` | Toast notification for connection state changes          |
| `RoomName`             | Display the current room name                            |
| `Toast`                | Generic toast notification component                     |
| `ChatEntry`            | Individual chat message entry                            |
| `SessionProvider`      | Provider for LiveKit session context                     |

### Control Components

| Component             | Description                                              |
| --------------------- | -------------------------------------------------------- |
| `TrackToggle`         | Toggle button for camera, microphone, or screen share    |
| `DisconnectButton`    | Button to disconnect from the room                       |
| `ChatToggle`          | Toggle button for chat panel                             |
| `FocusToggle`         | Toggle focus mode for a participant                      |
| `ClearPinButton`      | Button to clear pinned tracks                            |
| `MediaDeviceSelect`   | Dropdown for selecting audio/video devices               |
| `StartAudio`          | Button to start audio playback (browser autoplay policy) |
| `StartMediaButton`    | Button to start media with device selection              |
| `PaginationControl`   | Controls for paginating through participants             |
| `PaginationIndicator` | Display current pagination state                         |
| `SettingsMenuToggle`  | Toggle for settings menu                                 |

### Layout Components

| Component               | Description                                    |
| ----------------------- | ---------------------------------------------- |
| `GridLayout`            | Responsive grid layout for video tiles         |
| `CarouselLayout`        | Horizontal scrollable carousel for video tiles |
| `FocusLayout`           | Layout for focusing on a specific participant  |
| `FocusLayoutContainer`  | Container for focus layout                     |
| `LayoutContextProvider` | Provider for layout state                      |

### Participant Components

| Component                    | Description                                     |
| ---------------------------- | ----------------------------------------------- |
| `ParticipantTile`            | Video tile for a participant                    |
| `ParticipantAudioTile`       | Audio-only tile for a participant               |
| `VideoTrack`                 | Video track renderer                            |
| `AudioTrack`                 | Audio track renderer                            |
| `ConnectionQualityIndicator` | Display connection quality                      |
| `ParticipantName`            | Display participant name                        |
| `TrackMutedIndicator`        | Indicator for muted tracks                      |
| `AudioVisualizer`            | Visualize audio levels                          |
| `BarVisualizer`              | Bar-style audio visualizer for voice assistants |

## Prefabs

Ready-to-use conference components:

| Component                  | Description                                                           |
| -------------------------- | --------------------------------------------------------------------- |
| `VideoConference`          | Full video conference UI with grid layout, pagination, and focus mode |
| `AudioConference`          | Audio-only conference with participant list                           |
| `ControlBar`               | Standard controls for mic, camera, screen share, and disconnect       |
| `VoiceAssistantControlBar` | Specialized controls for AI voice assistant sessions                  |
| `PreJoin`                  | Pre-join preview screen with device selection                         |
| `Chat`                     | Chat panel with message input and history                             |
| `MediaDeviceMenu`          | Device selection dropdown for audio/video inputs                      |

## Hooks

### Participant Hooks

| Hook                             | Description                                 |
| -------------------------------- | ------------------------------------------- |
| `useLocalParticipant`            | Access the local participant                |
| `useRemoteParticipant`           | Access a specific remote participant        |
| `useParticipants`                | List all participants in the room           |
| `useRemoteParticipants`          | List remote participants only               |
| `useSpeakingParticipants`        | Get participants who are currently speaking |
| `useSortedParticipants`          | Get participants sorted by speaking status  |
| `useParticipantInfo`             | Get participant metadata                    |
| `useParticipantAttributes`       | Get all participant attributes              |
| `useParticipantAttribute`        | Get a specific participant attribute        |
| `useParticipantPermissions`      | Get participant permissions                 |
| `useLocalParticipantPermissions` | Get local participant permissions           |
| `useParticipantTracks`           | Get tracks for a specific participant       |
| `useParticipantTile`             | Utilities for participant tile components   |

### Track Hooks

| Hook                          | Description                           |
| ----------------------------- | ------------------------------------- |
| `useTracks`                   | Access media tracks by source         |
| `useTrackByName`              | Get a track by its name               |
| `useTrackMutedIndicator`      | Track mute state                      |
| `useIsMuted`                  | Check if a track is muted             |
| `useTrackVolume`              | Get track volume levels               |
| `useMultibandTrackVolume`     | Get multi-band volume data            |
| `useAudioWaveform`            | Get audio waveform data               |
| `useTrackTranscription`       | Get transcriptions for a track        |
| `useTrackSyncTime`            | Get track synchronization time        |
| `useTrackRefBySourceOrName`   | Get track reference by source or name |
| `useMediaTrackBySourceOrName` | Get media track by source or name     |
| `usePinnedTracks`             | Get/set pinned tracks                 |
| `useIsTrackPinned`            | Check if a track is pinned            |

### Room & Connection Hooks

| Hook                            | Description                         |
| ------------------------------- | ----------------------------------- |
| `useConnectionState`            | Track connection status             |
| `useRoomInfo`                   | Get room metadata                   |
| `useLiveKitRoom`                | Access and control the LiveKit room |
| `useIsSpeaking`                 | Detect if a participant is speaking |
| `useConnectionQuality`          | Get connection quality              |
| `useConnectionQualityIndicator` | Get connection quality for UI       |
| `useIsRecording`                | Check if room is being recorded     |
| `useIsEncrypted`                | Check if connection is encrypted    |
| `useAudioPlayback`              | Handle audio playback state         |

### Media Device Hooks

| Hook                       | Description                     |
| -------------------------- | ------------------------------- |
| `useMediaDevices`          | List available media devices    |
| `useMediaDeviceSelect`     | Control media device selection  |
| `useFacingMode`            | Get/set camera facing mode      |
| `usePersistentUserChoices` | Persist user device preferences |

### Control Hooks

| Hook                  | Description                             |
| --------------------- | --------------------------------------- |
| `useTrackToggle`      | Control track (mic/camera/screen) state |
| `useDisconnectButton` | Control disconnect button state         |
| `useFocusToggle`      | Control focus toggle                    |
| `useChatToggle`       | Control chat panel visibility           |
| `useClearPinButton`   | Control clear pin button                |
| `useStartAudio`       | Handle starting audio playback          |
| `useStartVideo`       | Handle starting video                   |
| `useSettingsToggle`   | Control settings menu                   |

### Layout Hooks

| Hook                    | Description                            |
| ----------------------- | -------------------------------------- |
| `useGridLayout`         | Calculate grid layout for participants |
| `usePagination`         | Paginate through participants          |
| `useVisualStableUpdate` | Stabilize visual updates               |
| `useSwipe`              | Handle swipe gestures                  |

### Chat & Data Hooks

| Hook                | Description                        |
| ------------------- | ---------------------------------- |
| `useChat`           | Send and receive chat messages     |
| `useDataChannel`    | Send/receive data channel messages |
| `useTextStream`     | Handle text streams                |
| `useTranscriptions` | Handle transcriptions              |

### Session & Agent Hooks

| Hook                                 | Description                          |
| ------------------------------------ | ------------------------------------ |
| `useSession`                         | Manage LiveKit sessions              |
| `useSessionMessages`                 | Handle session messages              |
| `useAgent`                           | Monitor agent state and attributes   |
| `useVoiceAssistant`                  | Interact with AI voice agents        |
| `useToken`                           | Generate/manage access tokens        |
| `useSequentialRoomConnectDisconnect` | Handle sequential connect/disconnect |

### Utility Hooks

| Hook                        | Description              |
| --------------------------- | ------------------------ |
| `useEvents`                 | Listen to LiveKit events |
| `useWarnAboutMissingStyles` | Warn if CSS is missing   |

### Internal/Reusable Hooks

| Hook                      | Description                             |
| ------------------------- | --------------------------------------- |
| `useObservableState`      | Convert RxJS observable to Svelte state |
| `useResizeObserver`       | Observe element size changes            |
| `useElementSize`          | Get element dimensions                  |
| `useMediaQuery`           | React to CSS media queries              |
| `useIsMobile`             | Check if viewport is mobile             |
| `useIsTablet`             | Check if viewport is tablet             |
| `useIsDesktop`            | Check if viewport is desktop            |
| `usePrefersReducedMotion` | Check prefers-reduced-motion            |
| `usePrefersDarkMode`      | Check prefers-color-scheme              |

### Cloud/Krisp Hooks

| Hook                  | Description                     |
| --------------------- | ------------------------------- |
| `useKrispNoiseFilter` | Enable Krisp noise cancellation |

## Context

Access room and participant data deeply in the component tree:

```svelte
<script>
	import {
		getRoomContext,
		getParticipantContext,
		getTrackRefContext,
		getLayoutContext,
		getChatContext,
		getPinContext,
		getSessionContext,
		getFeatureContext
	} from 'livekit-svelte';

	const room = getRoomContext();
	const participant = getParticipantContext();
	const trackRef = getTrackRefContext();
</script>
```

### Context Functions

| Function                                                                                    | Description                       |
| ------------------------------------------------------------------------------------------- | --------------------------------- |
| `setRoomContext` / `getRoomContext` / `ensureRoom`                                          | Room context                      |
| `setParticipantContext` / `getParticipantContext` / `ensureParticipant`                     | Participant context               |
| `isLocalParticipant` / `isRemoteParticipant`                                                | Participant type checks           |
| `setTrackRefContext` / `getTrackRefContext` / `ensureTrackRef`                              | Track reference context           |
| `isTrackReference`                                                                          | Check if value is track reference |
| `createLayoutContext` / `setLayoutContext` / `getLayoutContext` / `ensureLayoutContext`     | Layout context                    |
| `createChatContext` / `setChatContext` / `getChatContext` / `ensureChatContext`             | Chat context                      |
| `setPinContext` / `getPinContext` / `ensurePinContext`                                      | Pin state context                 |
| `createSessionContext` / `setSessionContext` / `getSessionContext` / `ensureSessionContext` | Session context                   |
| `createFeatureContext` / `setFeatureContext` / `getFeatureContext` / `ensureFeatureContext` | Feature flags context             |

## Usage Examples

### Basic Video Conference

```svelte
<script>
	import { LiveKitRoom, VideoConference } from 'livekit-svelte';

	const token = 'your-access-token';
	const serverUrl = 'wss://your-livekit-server.com';
</script>

<LiveKitRoom {token} {serverUrl} connect={true} audio={true} video={true}>
	<VideoConference />
</LiveKitRoom>
```

### Custom Participant Loop

```svelte
<script>
	import { ParticipantLoop, TrackLoop, ParticipantTile } from 'livekit-svelte';
</script>

<ParticipantLoop>
	{#snippet children({ participant })}
		<TrackLoop {participant}>
			{#snippet children({ trackRef })}
				<ParticipantTile {trackRef} />
			{/snippet}
		</TrackLoop>
	{/snippet}
</ParticipantLoop>
```

### Chat Integration

```svelte
<script>
	import { useChat } from 'livekit-svelte';

	const { send, messages, isSending } = useChat();
	let message = $state('');

	function handleSubmit(e) {
		e.preventDefault();
		send(message);
		message = '';
	}
</script>

<div class="messages">
	{#each messages as msg}
		<div class="message">
			<span class="sender">{msg.from?.identity}</span>
			<span class="text">{msg.message}</span>
		</div>
	{/each}
</div>

<form onsubmit={handleSubmit}>
	<input bind:value={message} placeholder="Type a message..." />
	<button type="submit" disabled={isSending}>Send</button>
</form>
```

### Voice Assistant

```svelte
<script>
	import { useAgent, useVoiceAssistant, BarVisualizer } from 'livekit-svelte';

	const { state } = useAgent();
	const voiceAssistant = useVoiceAssistant();
</script>

{#if state === 'connecting'}
	<BarVisualizer state="connecting" />
{:else if state === 'listening'}
	<BarVisualizer state="listening" />
{:else if state === 'thinking'}
	<BarVisualizer state="thinking" />
{/if}
```

### Track Controls

```svelte
<script>
	import { TrackToggle, DisconnectButton } from 'livekit-svelte';
</script>

<TrackToggle source="microphone" />
<TrackToggle source="camera" />
<TrackToggle source="screen_share" />
<DisconnectButton />
```

### Grid Layout with Pagination

```svelte
<script>
	import { GridLayout, useGridLayout, usePagination } from 'livekit-svelte';

	const { layout } = useGridLayout({ participantCount: 12 });
	const { currentPage, totalPages, nextPage, prevPage } = usePagination({
		totalItems: 12,
		itemsPerPage: 6
	});
</script>

<GridLayout>
	{#snippet children({ trackRefs })}
		{#each trackRefs as trackRef}
			<ParticipantTile {trackRef} />
		{/each}
	{/snippet}
</GridLayout>
```

### Media Device Selection

```svelte
<script>
	import { MediaDeviceSelect, useMediaDevices } from 'livekit-svelte';

	const devices = useMediaDevices({ kind: 'videoinput' });
</script>

<MediaDeviceSelect kind="videoinput" />
<MediaDeviceSelect kind="audioinput" />
```

## License

MIT
