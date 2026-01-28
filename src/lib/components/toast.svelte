<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		show: boolean;
		class?: string;
		children?: Snippet;
		onClose?: () => void;
	}

	let { show, class: className = '', children, onClose }: Props = $props();

	$effect(() => {
		if (show && onClose) {
			const timeout = setTimeout(() => {
				onClose();
			}, 3000);
			return () => clearTimeout(timeout);
		}
	});
</script>

{#if show}
	<div class="lk-toast {className}" role="alert">
		{@render children?.()}
	</div>
{/if}

<style>
	.lk-toast {
		position: fixed;
		bottom: 20px;
		left: 50%;
		transform: translateX(-50%);
		padding: 12px 24px;
		background: #333;
		color: white;
		border-radius: 8px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
		z-index: 1000;
		animation: toast-in 0.3s ease-out;
	}

	@keyframes toast-in {
		from {
			opacity: 0;
			transform: translateX(-50%) translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateX(-50%) translateY(0);
		}
	}
</style>
