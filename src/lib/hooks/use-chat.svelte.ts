import { setupChat, type ChatOptions, type ReceivedChatMessage } from '@livekit/components-core';
import type { Room } from 'livekit-client';
import { writable, type Writable } from 'svelte/store';
import { useObservableState } from './internal/observable-state.svelte.js';
import { ensureRoom } from '../context/room-context.svelte.js';

export interface ChatState {
	chatMessages: ReceivedChatMessage[];
	isSending: boolean;
}

export interface UseChatReturn {
	chatMessages: ReceivedChatMessage[];
	isSending: boolean;
	send: (message: string) => Promise<ReceivedChatMessage>;
}

export function useChat(options?: ChatOptions & { room?: Room }): UseChatReturn {
	const r = $derived(ensureRoom(options?.room));
	const { messageObservable, isSendingObservable, send } = $derived(setupChat(r, options));

	const chatMessages = useObservableState(messageObservable, []);
	const isSending = useObservableState(isSendingObservable, false);

	return {
		get chatMessages() {
			return chatMessages;
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
