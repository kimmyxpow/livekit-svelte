<script lang="ts" module>
	import type { Room } from 'livekit-client';

	export interface ConnectionStateToastProps {
		room?: Room;
		class?: string;
	}
</script>

<script lang="ts">
	import { useConnectionState } from '../hooks/use-connection-state.svelte.js';
	import { SpinnerIcon } from '../assets/icons/index.js';
	import Toast from './toast.svelte';

	let { room: roomProp, class: className = '' }: ConnectionStateToastProps = $props();

	const connectionState = useConnectionState(() => roomProp);

	const notification = $derived.by(() => {
		switch (connectionState) {
			case 'reconnecting':
				return { show: true, content: 'Reconnecting' };
			case 'connecting':
				return { show: true, content: 'Connecting' };
			case 'disconnected':
				return { show: true, content: 'Disconnected' };
			default:
				return { show: false, content: '' };
		}
	});
</script>

{#if notification.show}
	<Toast show={true} onClose={() => {}} class="lk-toast-connection-state {className}">
		{#if notification.content === 'Reconnecting' || notification.content === 'Connecting'}
			<SpinnerIcon className="lk-spinner" />
		{/if}
		{notification.content}
	</Toast>
{/if}
