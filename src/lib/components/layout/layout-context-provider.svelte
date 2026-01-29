<script lang="ts">
	import type { Snippet } from 'svelte';
	import { createLayoutContext, setLayoutContext } from '../../context/layout-context.svelte.js';
	import { setPinContext } from '../../context/pin-context.svelte.js';

	interface Props {
		children?: Snippet;
	}

	let { children }: Props = $props();

	const layoutContext = createLayoutContext();
	setLayoutContext(layoutContext);
	setPinContext({ pinState: layoutContext.pin.state! });
</script>

{@render children?.()}
