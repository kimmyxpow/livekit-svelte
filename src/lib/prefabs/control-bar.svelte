<script lang="ts">
	import { Track, type Room } from 'livekit-client';
	import TrackToggle from '../components/controls/track-toggle.svelte';
	import DisconnectButton from '../components/controls/disconnect-button.svelte';
	import ChatToggle from '../components/controls/chat-toggle.svelte';

	interface Props {
		room?: Room;
		class?: string;
		variation?: 'minimal' | 'verbose' | 'text';
	}

	let { room, class: className = '', variation: _variation = 'minimal' }: Props = $props();
</script>

<div class="lk-control-bar {className}">
	<TrackToggle source={Track.Source.Microphone}>
		{#snippet children(enabled)}
			{enabled ? 'Mute' : 'Unmute'}
		{/snippet}
	</TrackToggle>
	<TrackToggle source={Track.Source.Camera}>
		{#snippet children(enabled)}
			{enabled ? 'Stop Video' : 'Start Video'}
		{/snippet}
	</TrackToggle>
	<ChatToggle>
		{#snippet children(showChat)}
			{showChat ? 'Hide Chat' : 'Show Chat'}
		{/snippet}
	</ChatToggle>
	<DisconnectButton {room}>Disconnect</DisconnectButton>
</div>

<style>
	.lk-control-bar {
		display: flex;
		gap: 8px;
		padding: 12px;
		background: #1a1a1a;
		border-radius: 8px;
		justify-content: center;
		align-items: center;
	}
</style>
