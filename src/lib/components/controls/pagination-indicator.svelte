<script lang="ts">
	interface Props {
		currentPage: number;
		totalPages: number;
		onPageChange?: (page: number) => void;
		class?: string;
	}

	let { currentPage, totalPages, onPageChange, class: className = '' }: Props = $props();

	function goToPage(page: number) {
		onPageChange?.(page);
	}
</script>

<div class="lk-pagination-indicator {className}">
	{#each Array(totalPages) as _, i (i)}
		<button
			class="lk-page-dot"
			class:lk-active={i === currentPage}
			onclick={() => goToPage(i)}
			aria-label="Go to page {i + 1}"
			aria-current={i === currentPage ? 'page' : undefined}
		>
		</button>
	{/each}
</div>

<style>
	.lk-pagination-indicator {
		display: flex;
		gap: 8px;
		justify-content: center;
	}

	.lk-page-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		border: none;
		background: #666;
		cursor: pointer;
		transition: background 0.2s;
	}

	.lk-page-dot:hover {
		background: #888;
	}

	.lk-page-dot.lk-active {
		background: #0a84ff;
	}
</style>
