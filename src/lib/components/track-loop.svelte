<script lang="ts">
	import type { TrackReferenceOrPlaceholder } from '@livekit/components-core';
	import type { Snippet } from 'svelte';
	import { setTrackRefContext } from '../context/track-ref-context.svelte.js';
	import { setParticipantContext } from '../context/participant-context.svelte.js';

	interface Props {
		trackReferences: TrackReferenceOrPlaceholder[];
		children?: Snippet<[trackRef: TrackReferenceOrPlaceholder]>;
	}

	let { trackReferences, children }: Props = $props();
</script>

{#each trackReferences as trackRef (`${trackRef.participant.identity}-${trackRef.source}`)}
	{@const _setParticipantCtx = setParticipantContext(trackRef.participant)}
	{@const _setTrackCtx = setTrackRefContext(trackRef)}
	{@render children?.(trackRef)}
{/each}
