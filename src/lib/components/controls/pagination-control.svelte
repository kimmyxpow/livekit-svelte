<script lang="ts">
	import type { Snippet } from 'svelte';
	import Chevron from '../../assets/icons/Chevron.svelte';

	interface Props {
		currentPage: number;
		totalPages: number;
		onPageChange: (page: number) => void;
		class?: string;
		children?: Snippet<
			[currentPage: number, totalPages: number, nextPage: () => void, prevPage: () => void]
		>;
	}

	let { currentPage, totalPages, onPageChange, class: className = '', children }: Props = $props();

	function nextPage() {
		if (currentPage < totalPages - 1) {
			onPageChange(currentPage + 1);
		}
	}

	function prevPage() {
		if (currentPage > 0) {
			onPageChange(currentPage - 1);
		}
	}
</script>

<div class="lk-pagination-control {className}">
	{#if children}
		{@render children(currentPage, totalPages, nextPage, prevPage)}
	{:else}
		<button class="lk-button" onclick={prevPage} disabled={currentPage === 0}>
			<Chevron />
		</button>
		<span class="lk-pagination-count">{currentPage} of {totalPages}</span>
		<button class="lk-button" onclick={nextPage} disabled={currentPage === totalPages - 1}>
			<Chevron />
		</button>
	{/if}
</div>

<style>
	.lk-pagination-control {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	button {
		padding: 8px 16px;
		border-radius: 4px;
		border: none;
		background: #444;
		color: white;
		cursor: pointer;
		transition: background 0.2s;
	}

	button:hover:not(:disabled) {
		background: #555;
	}

	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	span {
		color: white;
		font-size: 14px;
	}
</style>
