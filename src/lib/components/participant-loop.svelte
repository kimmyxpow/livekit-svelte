<script lang="ts">
	import type { Participant } from 'livekit-client';
	import type { Snippet } from 'svelte';
	import { setParticipantContext } from '../context/participant-context.svelte.js';

	interface Props {
		participants: Participant[];
		children?: Snippet<[participant: Participant]>;
	}

	let { participants, children }: Props = $props();
</script>

{#each participants as participant (participant.identity)}
	{@const _setContext = setParticipantContext(participant)}
	{@render children?.(participant)}
{/each}
