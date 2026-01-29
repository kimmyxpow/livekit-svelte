<script lang="ts">
	import type { Participant } from 'livekit-client';
	import type { Snippet } from 'svelte';
	import { useParticipantInfo } from '../../hooks/use-participant-info.svelte.js';

	interface Props {
		participant?: Participant;
		class?: string;
		children?: Snippet;
	}

	let { participant, class: className = '', children }: Props = $props();

	const info = useParticipantInfo(() => participant);
</script>

<span class={className} data-lk-participant-name={info.name}>
	{info.name || info.identity}
	{#if children}
		{@render children()}
	{/if}
</span>
