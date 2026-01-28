<script lang="ts">
	import type { Room } from 'livekit-client';
	import type { Snippet } from 'svelte';
	import { ensureRoom } from '../../context/room-context.svelte.js';

	interface Props {
		room?: Room;
		class?: string;
		children?: Snippet;
		onDisconnect?: () => void;
	}

	let { room, class: className = '', children, onDisconnect }: Props = $props();

	async function disconnect() {
		const r = ensureRoom(room);
		await r.disconnect();
		onDisconnect?.();
	}
</script>

<button class="lk-disconnect-button {className}" onclick={disconnect}>
	{#if children}
		{@render children()}
	{:else}
		Disconnect
	{/if}
</button>

<style>
	.lk-disconnect-button {
		padding: 8px 16px;
		border-radius: 4px;
		border: none;
		background: #ff3b30;
		color: white;
		cursor: pointer;
		transition: background 0.2s;
	}

	.lk-disconnect-button:hover {
		background: #ff453a;
	}
</style>
