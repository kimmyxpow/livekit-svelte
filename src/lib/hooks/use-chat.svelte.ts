import { setupChat, type ReceivedChatMessage } from '@livekit/components-core';
import type { Room } from 'livekit-client';
import { writable, type Writable } from 'svelte/store';
import { useObservableState } from './internal/observable-state.svelte.js';
import { ensureRoom } from '../context/room-context.svelte.js';

export interface ChatState {
	messages: ReceivedChatMessage[];
	isSending: boolean;
}

export interface UseChatReturn {
	messages: ReceivedChatMessage[];
	isSending: boolean;
	send: (message: string) => Promise<ReceivedChatMessage>;
}

export function useChat(room?: Room | (() => Room | undefined)): UseChatReturn {
	const r = $derived(ensureRoom(typeof room === 'function' ? room() : room));
	const { messageObservable, isSendingObservable, send } = $derived(setupChat(r));

	const messages = useObservableState(messageObservable, []);
	const isSending = useObservableState(isSendingObservable, false);

	return {
		get messages() {
			return messages;
		},
		get isSending() {
			return isSending;
		},
		send
	};
}

export function createChatStore(room?: Room): {
	messages: Writable<ReceivedChatMessage[]>;
	send: (message: string) => Promise<void>;
} {
	const r = ensureRoom(room);
	const { messageObservable, send } = setupChat(r);

	const messages = writable<ReceivedChatMessage[]>([]);

	messageObservable.subscribe((msgs) => {
		messages.set(msgs);
	});

	return {
		messages,
		send: async (message: string) => {
			await send(message);
		}
	};
}
