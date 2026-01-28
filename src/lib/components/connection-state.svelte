<script lang="ts">
	import type { Room } from 'livekit-client';
	import { useConnectionState } from '../hooks/use-connection-state.svelte.js';

	interface Props {
		room?: Room;
		class?: string;
	}

	let { room: roomProp, class: className = '' }: Props = $props();

	const connectionState = useConnectionState(() => roomProp);
</script>

<span class={className}>
	{connectionState}
</span>
