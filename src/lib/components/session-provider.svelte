<script lang="ts">
	import type { Snippet } from 'svelte';
	import { createSessionContext, setSessionContext } from '../context/session-context.svelte.js';

	interface Props {
		children?: Snippet;
	}

	let { children }: Props = $props();

	const sessionContext = createSessionContext();
	setSessionContext(sessionContext);
</script>

{@render children?.()}
