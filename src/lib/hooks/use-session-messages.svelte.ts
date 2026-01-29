import type TypedEventEmitter from 'typed-emitter';
import { SendTextOptions } from 'livekit-client';
import { EventEmitter } from 'events';
import type {
	ReceivedMessage,
	ReceivedChatMessage,
	TextStreamData,
	ReceivedUserTranscriptionMessage,
	ReceivedAgentTranscriptionMessage
} from '@livekit/components-core';
import { useAgent } from './use-agent.svelte.js';
import { useTranscriptions } from './use-transcriptions.svelte.js';
import { useChat } from './use-chat.svelte.js';
import type { UseSessionReturn } from './use-session.svelte.js';
import { ensureSessionContext } from '../context/session-context.svelte.js';

/** @beta */
export type UseSessionMessagesReturn = {
	messages: Array<ReceivedMessage>;
	isSending: boolean;
	send: (message: string, options?: SendTextOptions) => Promise<ReceivedChatMessage>;
	internal: {
		emitter: TypedEventEmitter<MessagesCallbacks>;
	};
};

/** @beta */
export enum MessagesEvent {
	MessageReceived = 'messageReceived'
}

/** @beta */
export type MessagesCallbacks = {
	[MessagesEvent.MessageReceived]: (message: ReceivedMessage) => void;
};

/** @beta */
export function useSessionMessages(session?: UseSessionReturn): UseSessionMessagesReturn {
	const { room } = session ? { room: session.room } : ensureSessionContext();

	const emitter = new EventEmitter() as TypedEventEmitter<MessagesCallbacks>;

	const agent = useAgent(session);

	const transcriptions: Array<TextStreamData> = useTranscriptions({ room });
	const chat = useChat({ room });

	const transcriptionMessages: Array<
		ReceivedUserTranscriptionMessage | ReceivedAgentTranscriptionMessage
	> = $derived(
		transcriptions.map((transcription) => {
			switch (transcription.participantInfo.identity) {
				case room.localParticipant.identity:
					return {
						type: 'userTranscript',
						message: transcription.text,
						id: transcription.streamInfo.id,
						timestamp: transcription.streamInfo.timestamp,
						from: room.localParticipant
					};

				case agent.internal.agentParticipant?.identity:
				case agent.internal.workerParticipant?.identity:
					return {
						type: 'agentTranscript',
						message: transcription.text,
						id: transcription.streamInfo.id,
						timestamp: transcription.streamInfo.timestamp,
						from:
							agent.internal.agentParticipant?.identity === transcription.participantInfo.identity
								? agent.internal.agentParticipant
								: agent.internal.workerParticipant!
					};

				default:
					return {
						type: 'agentTranscript',
						message: transcription.text,
						id: transcription.streamInfo.id,
						timestamp: transcription.streamInfo.timestamp,
						from: Array.from(room.remoteParticipants.values()).find(
							(p) => p.identity === transcription.participantInfo.identity
						)
					};
			}
		})
	);

	const receivedMessages = $derived([...transcriptionMessages, ...chat.chatMessages]);

	// eslint-disable-next-line svelte/prefer-svelte-reactivity
	const messageFirstReceivedTimeMap = new Map<ReceivedMessage['id'], Date>();
	const sortedReceivedMessages = $derived.by(() => {
		// eslint-disable-next-line svelte/prefer-svelte-reactivity
		const now = new Date();
		for (const message of receivedMessages) {
			if (!messageFirstReceivedTimeMap.has(message.id)) {
				messageFirstReceivedTimeMap.set(message.id, now);
			}
		}

		return [...receivedMessages].sort((a, b) => {
			const aFirstReceivedAt = messageFirstReceivedTimeMap.get(a.id);
			const bFirstReceivedAt = messageFirstReceivedTimeMap.get(b.id);
			if (!aFirstReceivedAt || !bFirstReceivedAt) {
				return 0;
			}
			return aFirstReceivedAt.getTime() - bFirstReceivedAt.getTime();
		});
	});

	// eslint-disable-next-line svelte/prefer-svelte-reactivity
	const previouslyReceivedMessageIds = new Set<string>();
	$effect(() => {
		for (const message of sortedReceivedMessages) {
			if (previouslyReceivedMessageIds.has(message.id)) {
				continue;
			}

			previouslyReceivedMessageIds.add(message.id);
			emitter.emit(MessagesEvent.MessageReceived, message);
		}
	});

	return {
		messages: sortedReceivedMessages,
		send: chat.send,
		isSending: chat.isSending,
		internal: { emitter }
	};
}
