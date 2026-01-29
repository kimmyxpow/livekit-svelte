import { setupDisconnectButton } from '@livekit/components-core';
import { ConnectionState } from 'livekit-client';
import { ensureRoom } from '../context/room-context.svelte.js';
import { useConnectionState } from './use-connection-state.svelte.js';
import { mergeProps } from '../utils.js';

export interface DisconnectButtonProps {
	stopTracks?: boolean;
}

/**
 * The `useDisconnectButton` hook is used to implement the `DisconnectButton` or your
 * custom implementation of it. It adds onClick handler to the button to disconnect
 * from the room.
 *
 * @example
 * ```svelte
 * const { buttonProps } = useDisconnectButton(buttonProps);
 * ```
 * @public
 */
export function useDisconnectButton(props: DisconnectButtonProps) {
	const room = ensureRoom();
	const connectionState = useConnectionState(room);

	const { className, disconnect } = setupDisconnectButton(room);

	const buttonProps = mergeProps(props as Record<string, unknown>, {
		className,
		onclick: () => disconnect(props.stopTracks ?? true),
		disabled: connectionState === ConnectionState.Disconnected
	});

	return { buttonProps };
}
