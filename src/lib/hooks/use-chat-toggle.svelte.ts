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
	const { dispatch, state } = getLayoutContext().widget;
	const { className } = setupChatToggle();

	const mergedProps = mergeProps(props, {
		className,
		onclick: () => {
			if (dispatch) dispatch({ msg: 'toggle_chat' });
		},
		'aria-pressed': state?.showChat ? 'true' : 'false',
		'data-lk-unread-msgs': state
			? state.unreadMessages < 10
				? state.unreadMessages.toFixed(0)
				: '9+'
			: '0'
	});

	return { mergedProps };
}
