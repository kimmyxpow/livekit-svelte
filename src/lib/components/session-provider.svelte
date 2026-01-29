<script lang="ts">
	import type { Snippet } from 'svelte';
	import { createSessionContext, setSessionContext } from '../context/session-context.svelte.js';
	import type { UseSessionReturn } from '../hooks/use-session.svelte.js';

	interface Props {
		session: UseSessionReturn;
		children?: Snippet;
	}

	let { session, children }: Props = $props();

	const sessionContext = createSessionContext(session);
	setSessionContext(sessionContext);
</script>

{@render children?.()}
