<script lang="ts">
	import type { Participant } from 'livekit-client';
	import { useParticipantInfo } from '../../hooks/use-participant-info.svelte.js';

	interface Props {
		participant?: Participant;
		class?: string;
	}

	let { participant, class: className = '' }: Props = $props();

	const info = useParticipantInfo(() => participant);
</script>

<span class={className}>
	{info.name || info.identity}
</span>
