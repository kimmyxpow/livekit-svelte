import { generateConnectingSequenceBar } from '../components/participant/animation-sequences/connecting-sequence.js';
import { generateListeningSequenceBar } from '../components/participant/animation-sequences/listening-sequence.js';
import type { AgentState } from './use-agent.svelte.js';

export function useBarAnimator(
	state: AgentState | undefined,
	columns: number,
	interval: number
): () => number[] {
	let index = $state(0);
	let sequence = $state<number[][]>([[]]);

	$effect(() => {
		if (state === 'thinking') {
			sequence = generateListeningSequenceBar(columns);
		} else if (state === 'connecting' || state === 'initializing') {
			sequence = [...generateConnectingSequenceBar(columns)];
		} else if (state === 'listening') {
			sequence = generateListeningSequenceBar(columns);
		} else if (state === undefined || state === 'speaking') {
			sequence = [new Array(columns).fill(0).map((_, idx) => idx)];
		} else {
			sequence = [[]];
		}
		index = 0;
	});

	let animationFrameId: number | null = null;
	let startTime = $state(performance.now());

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

	const getCurrentBars = () => sequence[index % sequence.length];
	return getCurrentBars;
}
