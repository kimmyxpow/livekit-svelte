<script lang="ts" module>
	import {
		tokenize,
		createDefaultGrammar,
		type ReceivedChatMessage
	} from '@livekit/components-core';

	export type MessageFormatter = (message: string) => string;

	export interface ChatEntryProps {
		entry: ReceivedChatMessage;
		hideName?: boolean;
		hideTimestamp?: boolean;
		messageFormatter?: MessageFormatter;
		class?: string;
	}

	export function formatChatMessageLinks(message: string): string {
		// For Svelte, we return HTML string that can be rendered with @html
		return tokenize(message, createDefaultGrammar())
			.map((tok) => {
				if (typeof tok === 'string') {
					return tok;
				} else {
					const content = tok.content.toString();
					const href =
						tok.type === 'url'
							? /^http(s?):\/\//.test(content)
								? content
								: `https://${content}`
							: `mailto:${content}`;
					return `<a class="lk-chat-link" href="${href}" target="_blank" rel="noreferrer">${content}</a>`;
				}
			})
			.join('');
	}
</script>

<script lang="ts">
	let {
		entry,
		hideName = false,
		hideTimestamp = false,
		messageFormatter,
		class: className = ''
	}: ChatEntryProps = $props();

	const formattedMessage = $derived(
		messageFormatter ? messageFormatter(entry.message) : entry.message
	);
	const hasBeenEdited = $derived(!!entry.editTimestamp);
	const time = $derived(new Date(entry.timestamp));
	const locale = typeof navigator !== 'undefined' ? navigator.language : 'en-US';
	const name = $derived(entry.from?.name ?? entry.from?.identity);
</script>

<li
	class="lk-chat-entry {className}"
	title={time.toLocaleTimeString(locale, { timeStyle: 'full' })}
	data-lk-message-origin={entry.from?.isLocal ? 'local' : 'remote'}
>
	{#if !hideTimestamp || !hideName || hasBeenEdited}
		<span class="lk-meta-data">
			{#if !hideName}
				<strong class="lk-participant-name">{name}</strong>
			{/if}

			{#if !hideTimestamp || hasBeenEdited}
				<span class="lk-timestamp">
					{#if hasBeenEdited}edited
					{/if}
					{time.toLocaleTimeString(locale, { timeStyle: 'short' })}
				</span>
			{/if}
		</span>
	{/if}

	<span class="lk-message-body">{formattedMessage}</span>
	<span class="lk-message-attachements">
		{#if entry.attachedFiles}
			{#each entry.attachedFiles as file (file.name)}
				{#if file.type.startsWith('image/')}
					<img
						style:max-width="300px"
						style:max-height="300px"
						src={URL.createObjectURL(file)}
						alt={file.name}
					/>
				{/if}
			{/each}
		{/if}
	</span>
</li>

<style>
	.lk-chat-entry {
		padding: 8px 12px;
		border-radius: 4px;
		background: #2a2a2a;
		list-style: none;
	}

	.lk-meta-data {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 4px;
	}

	.lk-participant-name {
		font-weight: 600;
		color: #0a84ff;
		font-size: 13px;
	}

	.lk-timestamp {
		font-size: 11px;
		color: #888;
	}

	.lk-message-body {
		color: #fff;
		font-size: 14px;
		word-break: break-word;
	}

	.lk-message-attachements img {
		margin-top: 8px;
		border-radius: 4px;
	}

	:global(.lk-chat-link) {
		color: #0a84ff;
		text-decoration: underline;
	}
</style>
