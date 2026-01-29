<script lang="ts" module>
	import type { Room } from 'livekit-client';

	export interface ConnectionStateToastProps {
		room?: Room;
		class?: string;
	}
</script>

<script lang="ts">
	import { useConnectionState } from '../hooks/use-connection-state.svelte.js';
	import Toast from './toast.svelte';

	let { room: roomProp, class: className = '' }: ConnectionStateToastProps = $props();

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
