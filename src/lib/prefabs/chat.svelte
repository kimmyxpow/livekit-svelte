<script lang="ts">
	import type { ChatMessage, ChatOptions, ReceivedChatMessage } from '@livekit/components-core';
	import { useChat } from '../hooks/use-chat.svelte.js';
	import { useMaybeLayoutContext } from '../context/layout-context.svelte.js';
	import ChatEntry from '../components/chat-entry.svelte';
	import ChatToggle from '../components/controls/chat-toggle.svelte';
	import type { Snippet } from 'svelte';

	interface Props extends ChatOptions {
		class?: string;
		messageFormatter?: (message: string) => string;
		children?: Snippet<
			[{ entry: ReceivedChatMessage; messageFormatter?: (message: string) => string }]
		>;
	}

	let {
		class: className = '',
		messageFormatter,
		messageDecoder,
		messageEncoder,
		channelTopic,
		children
	}: Props = $props();

	const { chatMessages, send, isSending } = useChat({
		messageDecoder,
		messageEncoder,
		channelTopic
	});

	const layoutContext = useMaybeLayoutContext();
	let lastReadMsgAt = $state<ChatMessage['timestamp']>(0);

	let inputValue = $state('');
	let messagesContainer: HTMLUListElement;
	let inputRef: HTMLInputElement;

	$effect(() => {
		if (messagesContainer) {
			messagesContainer.scrollTo({ top: messagesContainer.scrollHeight });
		}
	});

	const widgetState = $derived(layoutContext?.widget.state);
	let currentWidgetState = $state<{ showChat?: boolean; unreadMessages?: number } | undefined>(
		undefined
	);

	$effect(() => {
		if (!widgetState) return;
		const unsubscribe = widgetState.subscribe(
			(state: { showChat?: boolean; unreadMessages?: number }) => {
				currentWidgetState = state;
			}
		);
		return unsubscribe;
	});

	$effect(() => {
		if (!layoutContext || chatMessages.length === 0) {
			return;
		}

		if (
			currentWidgetState?.showChat &&
			chatMessages.length > 0 &&
			lastReadMsgAt !== chatMessages[chatMessages.length - 1]?.timestamp
		) {
			lastReadMsgAt = chatMessages[chatMessages.length - 1]?.timestamp;
			return;
		}

		const unreadMessageCount = chatMessages.filter(
			(msg) => !lastReadMsgAt || msg.timestamp > lastReadMsgAt
		).length;

		const { widget } = layoutContext;
		if (unreadMessageCount > 0 && currentWidgetState?.unreadMessages !== unreadMessageCount) {
			widget.dispatch?.({ msg: 'unread_msg', count: unreadMessageCount });
		}
	});

	async function handleSubmit(event: Event) {
		event.preventDefault();
		if (!inputValue.trim() || isSending) return;

		await send(inputValue.trim());
		inputValue = '';
		inputRef?.focus();
	}
</script>

<div class="lk-chat {className}">
	<div class="lk-chat-header">
		Messages
		{#if layoutContext}
			<ChatToggle class="lk-close-button">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg
				>
			</ChatToggle>
		{/if}
	</div>

	<ul class="lk-list lk-chat-messages" bind:this={messagesContainer}>
		{#if children}
			{#each chatMessages as msg, idx (msg.id ?? idx)}
				{@render children({ entry: msg, messageFormatter })}
			{/each}
		{:else}
			{#each chatMessages as msg, idx (msg.id ?? idx)}
				{@const prevMsg = idx >= 1 ? chatMessages[idx - 1] : undefined}
				{@const hideName = idx >= 1 && prevMsg?.from === msg.from}
				{@const hideTimestamp = idx >= 1 && msg.timestamp - prevMsg!.timestamp < 60000}
				<ChatEntry
					entry={msg}
					{hideName}
					hideTimestamp={hideName === false ? false : hideTimestamp}
					{messageFormatter}
				/>
			{/each}
		{/if}
	</ul>
	<form class="lk-chat-form" onsubmit={handleSubmit}>
		<input
			class="lk-form-control lk-chat-form-input"
			disabled={isSending}
			bind:this={inputRef}
			bind:value={inputValue}
			type="text"
			placeholder="Enter a message..."
			oninput={(ev) => ev.stopPropagation()}
			onkeydown={(ev) => ev.stopPropagation()}
			onkeyup={(ev) => ev.stopPropagation()}
		/>
		<button type="submit" class="lk-button lk-chat-form-button" disabled={isSending}> Send </button>
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
