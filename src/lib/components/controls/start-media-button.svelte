<script lang="ts">
	import type { Room } from 'livekit-client';
	import type { Snippet } from 'svelte';
	import {
		roomAudioPlaybackAllowedObservable,
		roomVideoPlaybackAllowedObservable
	} from '@livekit/components-core';
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
	const { canPlayVideo } = useObservableState(
		() => roomVideoPlaybackAllowedObservable(ensureRoom(room)),
		{ canPlayVideo: true }
	);

	const needsPermission = $derived(!canPlayAudio || !canPlayVideo);

	async function startMedia() {
		const r = ensureRoom(room);
		if (!canPlayAudio) {
			await r.startAudio();
		}
		if (!canPlayVideo) {
			await r.startVideo();
		}
	}
</script>

{#if needsPermission}
	<button class="lk-start-media-button {className}" onclick={startMedia}>
		{#if children}
			{@render children()}
		{:else}
			Allow Media
		{/if}
	</button>
{/if}

<style>
	.lk-start-media-button {
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

	.lk-start-media-button:hover {
		background: #0066cc;
	}
</style>
