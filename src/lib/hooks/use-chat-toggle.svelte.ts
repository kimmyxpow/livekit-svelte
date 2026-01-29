import { setupChatToggle } from '@livekit/components-core';
import { getLayoutContext } from '../context/layout-context.svelte.js';
import { mergeProps } from '../utils.js';

/** @public */
export interface UseChatToggleProps {
	props: Record<string, unknown>;
}

/**
 * The `useChatToggle` hook provides state and functions for toggling the chat window.
 * @remarks
 * Depends on the `LayoutContext` to work properly.
 * @see {@link ChatToggle}, {@link Chat}
 * @public
 */
export function useChatToggle({ props }: UseChatToggleProps) {
	const layoutContext = getLayoutContext();
	const widget = layoutContext?.widget;
	const dispatch = widget?.dispatch;
	const stateStore = widget?.state;
	const { className } = setupChatToggle();

	const mergedProps = mergeProps(props as Record<string, unknown>, {
		className,
		onclick: () => {
			if (dispatch) dispatch({ msg: 'toggle_chat' });
		},
		'aria-pressed': stateStore ? 'false' : 'false',
		'data-lk-unread-msgs': '0'
	});

	return { mergedProps };
}
