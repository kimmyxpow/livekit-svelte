<script lang="ts">
	import type { Participant } from 'livekit-client';
	import type { Snippet } from 'svelte';
	import { ensureParticipant } from '../../context/participant-context.svelte.js';
	import ParticipantName from './participant-name.svelte';
	import ConnectionQualityIndicator from './connection-quality-indicator.svelte';

	interface Props {
		participant?: Participant;
		class?: string;
		children?: Snippet;
		avatar?: Snippet;
	}

	let { participant, class: className = '', children, avatar }: Props = $props();

	const p = $derived(ensureParticipant(participant));
</script>

<div class="lk-participant-audio-tile {className}">
	<div class="lk-participant-audio-content">
		{#if avatar}
			{@render avatar()}
		{:else}
			<div class="lk-audio-avatar"></div>
		{/if}
	</div>

	<div class="lk-participant-metadata">
		<div class="lk-participant-name-row">
			<ParticipantName participant={p} />
		</div>
		<ConnectionQualityIndicator participant={p} />
	</div>

	{#if children}
		{@render children()}
	{/if}
</div>

<style>
	.lk-participant-audio-tile {
		position: relative;
		width: 100%;
		height: 100%;
		background: #1a1a1a;
		border-radius: 8px;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	.lk-participant-audio-content {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.lk-audio-avatar {
		width: 80px;
		height: 80px;
		border-radius: 50%;
		background: #444;
	}

	.lk-participant-metadata {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 8px 12px;
		background: linear-gradient(transparent, rgba(0, 0, 0, 0.6));
		color: white;
	}

	.lk-participant-name-row {
		display: flex;
		align-items: center;
		gap: 8px;
	}
</style>
