<script lang="ts">
	import type { Room } from 'livekit-client';
	import { useParticipants } from '../hooks/use-participants.svelte.js';
	import LayoutContextProvider from '../components/layout/layout-context-provider.svelte';
	import ParticipantLoop from '../components/participant-loop.svelte';
	import ParticipantAudioTile from '../components/participant/participant-audio-tile.svelte';
	import RoomAudioRenderer from '../components/room-audio-renderer.svelte';
	import DisconnectButton from '../components/controls/disconnect-button.svelte';

	interface Props {
		room?: Room;
		class?: string;
	}

	let { room, class: className = '' }: Props = $props();

	const participants = useParticipants({}, () => room);
</script>

<LayoutContextProvider>
	<div class="lk-audio-conference {className}">
		<div class="lk-audio-conference-main">
			<ParticipantLoop {participants}>
				{#snippet children(participant)}
					<ParticipantAudioTile {participant} />
				{/snippet}
			</ParticipantLoop>
		</div>
		<RoomAudioRenderer {room} />
		<div class="lk-audio-conference-controls">
			<DisconnectButton {room}>Disconnect</DisconnectButton>
		</div>
	</div>
</LayoutContextProvider>

<style>
	.lk-audio-conference {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100vh;
		background: #1a1a1a;
	}

	.lk-audio-conference-main {
		flex: 1;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 16px;
		padding: 16px;
		overflow-y: auto;
	}

	.lk-audio-conference-controls {
		padding: 16px;
		display: flex;
		justify-content: center;
		background: #2a2a2a;
	}
</style>
