import { setupClearPinButton } from '@livekit/components-core';
import { getLayoutContext } from '../context/layout-context.svelte.js';
import { mergeProps } from '../utils.js';

export interface ClearPinButtonProps {
	stopTracks?: boolean;
}

/**
 * The `useClearPinButton` hook provides props for the {@link ClearPinButton}
 * or your custom implementation of it component. It adds the `onClick` handler
 * to signal the `LayoutContext` that the tile in focus should be cleared.
 * @public
 */
export function useClearPinButton(props: ClearPinButtonProps) {
	const layoutContext = getLayoutContext();
	const { state, dispatch } = layoutContext.pin;

	const { className } = setupClearPinButton();

	const buttonProps = mergeProps(props, {
		className,
		disabled: !state?.length,
		onclick: () => {
			if (dispatch) dispatch({ msg: 'clear_pin' });
		}
	});

	return { buttonProps };
}
