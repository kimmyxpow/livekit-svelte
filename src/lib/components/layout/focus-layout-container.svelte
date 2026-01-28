<script lang="ts">
	import type { TrackReferenceOrPlaceholder } from '@livekit/components-core';
	import type { Snippet } from 'svelte';
	import { writable } from 'svelte/store';
	import type { PinState } from '@livekit/components-core';
	import { setPinContext } from '../../context/pin-context.svelte.js';

	interface Props {
		pinnedTrack?: TrackReferenceOrPlaceholder;
		class?: string;
		children?: Snippet;
	}

	let { pinnedTrack, class: className = '', children }: Props = $props();

	const pinState = writable<PinState>(pinnedTrack ? [pinnedTrack] : []);
	setPinContext({ pinState });

	$effect(() => {
		pinState.set(pinnedTrack ? [pinnedTrack] : []);
	});
</script>

<div class="lk-focus-layout-container {className}">
	{@render children?.()}
</div>

<style>
	.lk-focus-layout-container {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
		gap: 8px;
	}
</style>
