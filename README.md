# LiveKit Svelte (Unofficial)

An **unofficial** Svelte 5-native wrapper for [LiveKit](https://livekit.io), providing reactive components and hooks for building real-time video and audio applications.

> **Note**: This is a community-driven library and is not officially maintained by LiveKit.

## Installation

```sh
bun add livekit-svelte livekit-client
```

## Quick Start

```svelte
<script>
	import { LiveKitRoom, VideoConference } from 'livekit-svelte';

	const serverUrl = 'wss://your-livekit-server.com';
	const token = 'your-access-token';
</script>

<LiveKitRoom {serverUrl} {token} audio video>
	<VideoConference />
</LiveKitRoom>
```

## Features

- **Svelte 5** - Built with runes ($state, $derived, $effect) for optimal reactivity
- **LiveKit Components Core** - Powered by `@livekit/components-core` for consistent behavior
- **TypeScript** - Full type safety with TypeScript support
- **Modular** - Import only what you need

## Components

### Room Components

- `LiveKitRoom` - Room provider and connection manager
- `VideoConference` - Complete video conferencing UI
- `AudioConference` - Audio-only conferencing UI
- `RoomAudioRenderer` - Renders all room audio tracks

### Participant Components

- `ParticipantTile` - Video tile for a participant
- `ParticipantAudioTile` - Audio-only tile for a participant
- `ParticipantName` - Display participant name
- `ConnectionQualityIndicator` - Show connection quality
- `VideoTrack` - Render video track
- `AudioTrack` - Render audio track
- `TrackMutedIndicator` - Show muted state indicator

### Layout Components

- `GridLayout` - Grid layout for multiple participants
- `FocusLayout` - Focus layout for pinned track
- `CarouselLayout` - Carousel layout for tracks
- `LayoutContextProvider` - Layout context provider

### Controls

- `TrackToggle` - Toggle camera/microphone/screen share
- `DisconnectButton` - Disconnect from room
- `ChatToggle` - Toggle chat visibility
- `FocusToggle` - Pin/unpin track
- `MediaDeviceSelect` - Select audio/video devices
- `ClearPinButton` - Clear all pinned tracks

### Chat

- `Chat` - Chat component
- `ChatEntry` - Individual chat message

## Hooks

### Room Hooks

- `useLiveKitRoom` - Access and control room connection
- `useConnectionState` - Track connection state
- `useRoomInfo` - Get room metadata

### Participant Hooks

- `useParticipants` - Get all participants
- `useRemoteParticipants` - Get remote participants only
- `useLocalParticipant` - Get local participant
- `useParticipantInfo` - Get participant info
- `useConnectionQuality` - Track connection quality
- `useIsSpeaking` - Track speaking state

### Track Hooks

- `useTracks` - Get tracks by source
- `useTrackToggle` - Toggle track publication
- `useTrackMutedIndicator` - Track muted state
- `usePinnedTracks` - Get pinned tracks

### Device Hooks

- `useMediaDevices` - List available media devices
- `useMediaDeviceSelect` - Select active device

### Chat Hooks

- `useChat` - Send and receive chat messages

## License

MIT
