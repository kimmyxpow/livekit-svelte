<script lang="ts" module>
	import type { AgentState } from '../../hooks/use-agent.svelte.js';
	import { generateConnectingSequenceBar } from './animation-sequences/connecting-sequence.js';
	import { generateListeningSequenceBar } from './animation-sequences/listening-sequence.js';
	import { generateThinkingSequenceBar } from './animation-sequences/thinking-sequence.js';

	const sequencerIntervals = new Map<AgentState | undefined, number>([
		['connecting', 2000],
		['initializing', 2000],
		['listening', 500],
		['thinking', 150]
	]);

	const getSequencerInterval = (
		state: AgentState | undefined,
		barCount: number
	): number | undefined => {
		if (state === undefined) {
			return 1000;
		}
		let interval = sequencerIntervals.get(state);
		if (interval) {
			switch (state) {
				case 'connecting':
					interval /= barCount;
					break;
				default:
					break;
			}
		}
		return interval;
	};

	const getSequence = (state: AgentState | undefined, barCount: number): number[][] => {
		if (state === 'thinking') {
			return generateThinkingSequenceBar(barCount);
		} else if (state === 'connecting' || state === 'initializing') {
			return [...generateConnectingSequenceBar(barCount)];
		} else if (state === 'listening') {
			return generateListeningSequenceBar(barCount);
		} else if (state === undefined || state === 'speaking') {
			return [new Array(barCount).fill(0).map((_, idx) => idx)];
		} else {
			return [[]];
		}
	};
</script>

<script lang="ts">
	import type { TrackReferenceOrPlaceholder } from '@livekit/components-core';
	import type { LocalAudioTrack, RemoteAudioTrack } from 'livekit-client';
	import { useMaybeTrackRefContext } from '../../context/track-ref-context.svelte.js';
	import { useMultibandTrackVolume } from '../../hooks/use-track-volume.svelte.js';

	export interface BarVisualizerOptions {
		/** in percentage */
		maxHeight?: number;
		/** in percentage */
		minHeight?: number;
	}

	interface Props {
		/** If set, the visualizer will transition between different voice assistant states */
		vaState?: AgentState;
		/** Number of bars that show up in the visualizer */
		barCount?: number;
		/** Track reference or audio track to visualize */
		trackRef?: TrackReferenceOrPlaceholder | LocalAudioTrack | RemoteAudioTrack;
		/** Track to visualize (alternative to trackRef) */
		track?: TrackReferenceOrPlaceholder | LocalAudioTrack | RemoteAudioTrack;
		options?: BarVisualizerOptions;
		class?: string;
	}

	let { vaState, barCount = 15, trackRef, track, options, class: className = '' }: Props = $props();

	const contextTrack = useMaybeTrackRefContext();

	const targetTrack = $derived(trackRef ?? track ?? contextTrack);

	const volumeBands = useMultibandTrackVolume(
		() => targetTrack,
		() => ({
			bands: barCount,
			loPass: 100,
			hiPass: 200
		})
	);

	const minHeight = $derived(options?.minHeight ?? 20);
	const maxHeight = $derived(options?.maxHeight ?? 100);

	// Animation state
	let index = $state(0);
	let sequence = $state<number[][]>([[]]);
	let animationFrameId: number | null = null;
	let startTime = $state(performance.now());

	const interval = $derived(getSequencerInterval(vaState, barCount) ?? 100);

	$effect(() => {
		sequence = getSequence(vaState, barCount);
		index = 0;
	});

	$effect(() => {
		startTime = performance.now();

		const animate = (time: number) => {
			const timeElapsed = time - startTime;

			if (timeElapsed >= interval) {
				index = index + 1;
				startTime = time;
			}

			animationFrameId = requestAnimationFrame(animate);
		};

		animationFrameId = requestAnimationFrame(animate);

		return () => {
			if (animationFrameId !== null) {
				cancelAnimationFrame(animationFrameId);
			}
		};
	});

	const highlightedIndices = $derived(sequence[index % sequence.length] ?? []);
</script>

<div class="lk-audio-bar-visualizer {className}" data-lk-va-state={vaState}>
	{#each volumeBands as volume, idx (idx)}
		<span
			data-lk-highlighted={highlightedIndices.includes(idx)}
			data-lk-bar-index={idx}
			class="lk-audio-bar"
			class:lk-highlighted={highlightedIndices.includes(idx)}
			style:height="{Math.min(maxHeight, Math.max(minHeight, volume * 100 + 5))}%"
		></span>
	{/each}
</div>

<style>
	.lk-audio-bar-visualizer {
		display: flex;
		align-items: flex-end;
		justify-content: center;
		gap: 2px;
		height: 100%;
		width: 100%;
	}

	.lk-audio-bar {
		flex: 1;
		background-color: var(--lk-va-bg, #666);
		border-radius: 2px;
		transition: background-color 0.1s;
		min-height: 5%;
	}

	.lk-audio-bar.lk-highlighted {
		background-color: var(--lk-fg, #0a84ff);
	}
</style>
