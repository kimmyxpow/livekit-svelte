import { getContext, setContext } from 'svelte';
import type { ReceivedChatMessage } from '@livekit/components-core';
import type { Writable } from 'svelte/store';
import { CHAT_CONTEXT_KEY } from './keys.js';

export interface ChatContext {
	messages: Writable<ReceivedChatMessage[]>;
	send: (message: string) => Promise<ReceivedChatMessage | void>;
}

export function createChatContext(
	messages: Writable<ReceivedChatMessage[]>,
	send: (message: string) => Promise<ReceivedChatMessage | void>
): ChatContext {
	return { messages, send };
}

export function setChatContext(context: ChatContext): void {
	setContext(CHAT_CONTEXT_KEY, context);
}

export function getChatContext(): ChatContext | undefined {
	return getContext<ChatContext>(CHAT_CONTEXT_KEY);
}

export function ensureChatContext(): ChatContext {
	const ctx = getChatContext();
	if (!ctx) {
		throw new Error('No chat context found. Make sure the component is inside a Chat component.');
	}
	return ctx;
}
