<script lang="ts">
	import type { ReceivedChatMessage } from '@livekit/components-core';

	interface Props {
		message: ReceivedChatMessage;
		class?: string;
	}

	let { message, class: className = '' }: Props = $props();

	const timestamp = $derived(
		new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
	);
</script>

<div class="lk-chat-entry {className}">
	<div class="lk-chat-entry-header">
		<span class="lk-chat-entry-sender"
			>{message.from?.name || message.from?.identity || 'Unknown'}</span
		>
		<span class="lk-chat-entry-timestamp">{timestamp}</span>
	</div>
	<div class="lk-chat-entry-message">{message.message}</div>
</div>

<style>
	.lk-chat-entry {
		padding: 8px 12px;
		border-radius: 4px;
		background: #2a2a2a;
	}

	.lk-chat-entry-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 4px;
	}

	.lk-chat-entry-sender {
		font-weight: 600;
		color: #0a84ff;
		font-size: 13px;
	}

	.lk-chat-entry-timestamp {
		font-size: 11px;
		color: #888;
	}

	.lk-chat-entry-message {
		color: #fff;
		font-size: 14px;
		word-break: break-word;
	}
</style>
