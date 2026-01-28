<script lang="ts">
	import type { TrackReferenceOrPlaceholder } from '@livekit/components-core';
	import type { Snippet } from 'svelte';
	import { setTrackRefContext } from '../../context/track-ref-context.svelte.js';
	import { setParticipantContext } from '../../context/participant-context.svelte.js';

	interface Props {
		trackRef: TrackReferenceOrPlaceholder;
		class?: string;
		children?: Snippet;
	}

	let { trackRef, class: className = '', children }: Props = $props();

	$effect(() => {
		setParticipantContext(trackRef.participant);
		setTrackRefContext(trackRef);
	});
</script>

<div class="lk-focus-layout {className}">
	{@render children?.()}
</div>

<style>
	.lk-focus-layout {
		position: relative;
		width: 100%;
		height: 100%;
	}
</style>
