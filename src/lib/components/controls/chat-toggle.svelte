<script lang="ts">
	import type { Snippet } from 'svelte';
	import { ensureLayoutContext } from '../../context/layout-context.svelte.js';

	interface Props {
		class?: string;
		children?: Snippet<[showChat: boolean]>;
	}

	let { class: className = '', children }: Props = $props();

	const layout = ensureLayoutContext();

	let showChat = $state(false);

	layout.widget.state?.subscribe((state) => {
		showChat = state.showChat;
	});

	function toggle() {
		layout.widget.state?.update((state) => ({
			...state,
			showChat: !state.showChat
		}));
	}
</script>

<button
	class="lk-chat-toggle {className}"
	class:lk-active={showChat}
	onclick={toggle}
	aria-pressed={showChat}
>
	{#if children}
		{@render children(showChat)}
	{:else}
		{showChat ? 'Hide Chat' : 'Show Chat'}
	{/if}
</button>

<style>
	.lk-chat-toggle {
		padding: 8px 16px;
		border-radius: 4px;
		border: none;
		background: #444;
		color: white;
		cursor: pointer;
		transition: background 0.2s;
	}

	.lk-chat-toggle:hover {
		background: #555;
	}

	.lk-chat-toggle.lk-active {
		background: #0a84ff;
	}
</style>
