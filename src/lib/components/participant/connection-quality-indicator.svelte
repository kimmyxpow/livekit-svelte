<script lang="ts">
	import type { Participant } from 'livekit-client';
	import { ConnectionQuality } from 'livekit-client';
	import { useConnectionQuality } from '../../hooks/use-connection-quality.svelte.js';

	interface Props {
		participant?: Participant;
		class?: string;
	}

	let { participant, class: className = '' }: Props = $props();

	const quality = useConnectionQuality(() => participant);

	const qualityLabel = $derived.by(() => {
		switch (quality) {
			case ConnectionQuality.Excellent:
				return 'Excellent';
			case ConnectionQuality.Good:
				return 'Good';
			case ConnectionQuality.Poor:
				return 'Poor';
			default:
				return 'Unknown';
		}
	});

	const qualityBars = $derived.by(() => {
		switch (quality) {
			case ConnectionQuality.Excellent:
				return 3;
			case ConnectionQuality.Good:
				return 2;
			case ConnectionQuality.Poor:
				return 1;
			default:
				return 0;
		}
	});
</script>

<div class={className} aria-label="Connection quality: {qualityLabel}">
	{#each Array(3) as _, index (index)}
		<div
			class="lk-connection-quality-bar"
			class:active={index < qualityBars}
			style:height="{((index + 1) / 3) * 100}%"
		></div>
	{/each}
</div>

<style>
	.lk-connection-quality-bar {
		width: 3px;
		background-color: var(--lk-connection-quality-bg, #666);
		border-radius: 1px;
		transition: background-color 0.2s;
	}

	.lk-connection-quality-bar.active {
		background-color: var(--lk-connection-quality-active, #0f0);
	}

	div {
		display: flex;
		align-items: flex-end;
		gap: 2px;
		height: 12px;
	}
</style>
