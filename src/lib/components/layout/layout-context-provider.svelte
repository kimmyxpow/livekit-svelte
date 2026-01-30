<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { PinState, WidgetState } from '@livekit/components-core';
	import { log } from '@livekit/components-core';
	import { createLayoutContext, setLayoutContext } from '../../context/layout-context.svelte.js';
	import { setPinContext } from '../../context/pin-context.svelte.js';

	interface Props {
		children?: Snippet;
		onWidgetChange?: (state: WidgetState) => void;
		onPinChange?: (state: PinState) => void;
	}

	let { children, onWidgetChange, onPinChange }: Props = $props();

	const layoutContext = createLayoutContext();
	setLayoutContext(layoutContext);
	setPinContext({ pinState: layoutContext.pin.state! });

	$effect(() => {
		if (layoutContext.pin.state) {
			const unsubscribe = layoutContext.pin.state.subscribe((pinState) => {
				log.debug('PinState Updated', { state: pinState });
				onPinChange?.(pinState);
			});
			return unsubscribe;
		}
	});

	$effect(() => {
		if (layoutContext.widget.state) {
			const unsubscribe = layoutContext.widget.state.subscribe((widgetState) => {
				log.debug('Widget Updated', { widgetState });
				onWidgetChange?.(widgetState);
			});
			return unsubscribe;
		}
	});
</script>

{@render children?.()}
