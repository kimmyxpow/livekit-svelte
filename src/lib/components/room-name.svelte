<script lang="ts">
	import type { Room } from 'livekit-client';
	import { useRoomInfo } from '../hooks/use-room-info.svelte.js';

	interface Props {
		room?: Room;
		class?: string;
	}

	let { room, class: className = '' }: Props = $props();

	const info = useRoomInfo(() => room);
</script>

<span class={className}>
	{info.name}
</span>
