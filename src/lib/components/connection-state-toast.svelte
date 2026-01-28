<script lang="ts">
	import type { Room } from 'livekit-client';
	import { useConnectionState } from '../hooks/use-connection-state.svelte.js';
	import Toast from './toast.svelte';

	interface Props {
		room?: Room;
		class?: string;
	}

	let { room: roomProp, class: className = '' }: Props = $props();

	const connectionState = useConnectionState(() => roomProp);

	let showToast = $state(false);
	let lastState = $state(connectionState);

	$effect(() => {
		if (connectionState !== lastState) {
			if (connectionState === 'reconnecting' || connectionState === 'disconnected') {
				showToast = true;
			}
			lastState = connectionState;
		}
	});

	const toastMessage = $derived.by(() => {
		switch (connectionState) {
			case 'connecting':
				return 'Connecting...';
			case 'connected':
				return 'Connected';
			case 'reconnecting':
				return 'Reconnecting...';
			case 'disconnected':
				return 'Disconnected';
			default:
				return '';
		}
	});
</script>

<Toast show={showToast} onClose={() => (showToast = false)} class={className}>
	{toastMessage}
</Toast>
