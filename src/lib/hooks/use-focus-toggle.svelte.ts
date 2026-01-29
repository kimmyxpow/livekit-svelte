import { setupFocusToggle, isTrackReferencePinned } from '@livekit/components-core';
import type { TrackReferenceOrPlaceholder } from '@livekit/components-core';
import { ensureTrackRef } from '../context/track-ref-context.svelte.js';
import { getLayoutContext } from '../context/layout-context.svelte.js';
import { mergeProps } from '../utils.js';

/** @public */
export interface UseFocusToggleProps {
	trackRef?: TrackReferenceOrPlaceholder;
	props: Record<string, unknown>;
}

/**
 * The `useFocusToggle` hook is used to implement the `FocusToggle` or your custom implementation of it.
 * The `TrackReferenceOrPlaceholder` is used to register a onClick handler and to identify the track to focus on.
 *
 * @example
 * ```svelte
 * const { mergedProps, inFocus } = useFocusToggle({ trackRef, props: yourButtonProps });
 * ```
 * @public
 */
export function useFocusToggle({ trackRef, props }: UseFocusToggleProps) {
	const trackReference = ensureTrackRef(trackRef);
	const layoutContext = getLayoutContext();

	const { className } = setupFocusToggle();

	const inFocus = isTrackReferencePinned(trackReference, layoutContext?.pin.state);

	const mergedProps = mergeProps(props, {
		className,
		onclick: (event: MouseEvent) => {
			// Call user defined on click callbacks.
			if (typeof props.onclick === 'function') {
				(props.onclick as (e: MouseEvent) => void)(event);
			}

			// Set or clear focus based on current focus state.
			if (inFocus) {
				layoutContext?.pin.dispatch?.({
					msg: 'clear_pin'
				});
			} else {
				layoutContext?.pin.dispatch?.({
					msg: 'set_pin',
					trackReference
				});
			}
		}
	});

	return { mergedProps, inFocus };
}
