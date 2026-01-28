<script lang="ts">
	import type { Room } from 'livekit-client';
	import type { ReceivedChatMessage } from '@livekit/components-core';
	import { useChat } from '../hooks/use-chat.svelte.js';
	import { setChatContext } from '../context/chat-context.svelte.js';
	import { writable } from 'svelte/store';
	import ChatEntry from './chat-entry.svelte';

	interface Props {
		room?: Room;
		class?: string;
	}

	let { room, class: className = '' }: Props = $props();

	const { messages, isSending, send } = useChat(() => room);

	const messagesStore = writable<ReceivedChatMessage[]>([]);
	$effect(() => {
		messagesStore.set(messages);
	});

	setChatContext({
		messages: messagesStore,
		send
	});

	let inputValue = $state('');
	let messagesContainer: HTMLDivElement;

	$effect(() => {
		// Auto-scroll to bottom when messages change
		if (messagesContainer) {
			messagesContainer.scrollTop = messagesContainer.scrollHeight;
		}
	});

	async function handleSubmit(event: Event) {
		event.preventDefault();
		if (!inputValue.trim() || isSending) return;

		await send(inputValue.trim());
		inputValue = '';
	}
</script>

<div class="lk-chat {className}">
	<div class="lk-chat-messages" bind:this={messagesContainer}>
		{#each messages as message (message.id)}
			<ChatEntry {message} />
		{/each}
	</div>
	<form class="lk-chat-input" onsubmit={handleSubmit}>
		<input
			type="text"
			placeholder="Type a message..."
			bind:value={inputValue}
			disabled={isSending}
		/>
		<button type="submit" disabled={!inputValue.trim() || isSending}>Send</button>
	</form>
</div>

<style>
	.lk-chat {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
		background: #1a1a1a;
		border-radius: 8px;
		overflow: hidden;
	}

	.lk-chat-messages {
		flex: 1;
		overflow-y: auto;
		padding: 12px;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.lk-chat-input {
		display: flex;
		gap: 8px;
		padding: 12px;
		background: #2a2a2a;
	}

	.lk-chat-input input {
		flex: 1;
		padding: 8px 12px;
		border-radius: 4px;
		border: 1px solid #444;
		background: #333;
		color: white;
		font-size: 14px;
	}

	.lk-chat-input input:focus {
		outline: none;
		border-color: #0a84ff;
	}

	.lk-chat-input button {
		padding: 8px 16px;
		border-radius: 4px;
		border: none;
		background: #0a84ff;
		color: white;
		cursor: pointer;
		font-size: 14px;
		font-weight: 500;
		transition: background 0.2s;
	}

	.lk-chat-input button:hover:not(:disabled) {
		background: #0066cc;
	}

	.lk-chat-input button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
