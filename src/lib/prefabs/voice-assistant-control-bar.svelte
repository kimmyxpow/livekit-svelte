<script lang="ts">
	import { Track } from 'livekit-client';
	import TrackToggle from '../components/controls/track-toggle.svelte';
	import DisconnectButton from '../components/controls/disconnect-button.svelte';
	import StartMediaButton from '../components/controls/start-media-button.svelte';
	import BarVisualizer from '../components/participant/bar-visualizer.svelte';
	import MediaDeviceMenu from './media-device-menu.svelte';
	import { useLocalParticipant } from '../hooks/use-local-participant.svelte.js';
	import { useLocalParticipantPermissions } from '../hooks/use-local-participant-permissions.svelte.js';

	interface Controls {
		microphone?: boolean;
		leave?: boolean;
	}

	interface Props {
		controls?: Controls;
		class?: string;
	}

	let { controls, class: className = '' }: Props = $props();

	const visibleControls = $derived({ leave: true, microphone: true, ...controls });

	const localPermissions = useLocalParticipantPermissions();
	const { microphoneTrack, localParticipant } = useLocalParticipant();

	const micTrackRef = $derived({
		participant: localParticipant,
		source: Track.Source.Microphone,
		publication: microphoneTrack
	});

	const effectiveControls = $derived.by(() => {
		const result = { ...visibleControls };
		if (!localPermissions) {
			result.microphone = false;
		} else {
			result.microphone = visibleControls.microphone ?? localPermissions.canPublish;
		}
		return result;
	});
</script>

<div class="lk-agent-control-bar {className}">
	{#if effectiveControls.microphone}
		<div class="lk-button-group">
			<TrackToggle source={Track.Source.Microphone} showIcon={true}>
				<BarVisualizer trackRef={micTrackRef} barCount={7} options={{ minHeight: 5 }} />
			</TrackToggle>
			<div class="lk-button-group-menu">
				<MediaDeviceMenu kind="audioinput" />
			</div>
		</div>
	{/if}

	{#if effectiveControls.leave}
		<DisconnectButton>Disconnect</DisconnectButton>
	{/if}
	<StartMediaButton />
</div>

<style>
	.lk-agent-control-bar {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 12px;
		background: #1a1a1a;
		border-radius: 8px;
	}

	.lk-button-group {
		display: flex;
		align-items: center;
	}

	.lk-button-group-menu {
		margin-left: 4px;
	}
</style>
