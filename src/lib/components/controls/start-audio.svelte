<script lang="ts">
	import type { Room } from 'livekit-client';
	import type { Snippet } from 'svelte';
	import { roomAudioPlaybackAllowedObservable } from '@livekit/components-core';
	import { useObservableState } from '../../hooks/internal/observable-state.svelte.js';
	import { ensureRoom } from '../../context/room-context.svelte.js';

	interface Props {
		room?: Room;
		class?: string;
		children?: Snippet;
	}

	let { room, class: className = '', children }: Props = $props();

	const { canPlayAudio } = useObservableState(
		() => roomAudioPlaybackAllowedObservable(ensureRoom(room)),
		{ canPlayAudio: true }
	);

	async function startAudio() {
		const r = ensureRoom(room);
		await r.startAudio();
	}
</script>

{#if !canPlayAudio}
	<button class="lk-start-audio {className}" onclick={startAudio}>
		{#if children}
			{@render children()}
		{:else}
			Allow Audio
		{/if}
	</button>
{/if}

<style>
	.lk-start-audio {
		padding: 12px 24px;
		border-radius: 4px;
		border: none;
		background: #0a84ff;
		color: white;
		cursor: pointer;
		font-size: 14px;
		font-weight: 500;
		transition: background 0.2s;
	}

	.lk-start-audio:hover {
		background: #0066cc;
	}
</style>
