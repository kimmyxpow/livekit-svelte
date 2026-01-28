import type { TrackReferenceOrPlaceholder } from '@livekit/components-core';

export interface UsePaginationOptions {
	trackReferences: TrackReferenceOrPlaceholder[];
	itemsPerPage: number;
}

export interface PaginationState {
	currentPage: number;
	totalPages: number;
	paginatedItems: TrackReferenceOrPlaceholder[];
	nextPage: () => void;
	prevPage: () => void;
	setPage: (page: number) => void;
}

export function usePagination(options: UsePaginationOptions): PaginationState {
	let currentPage = $state(0);

	const totalPages = $derived(Math.ceil(options.trackReferences.length / options.itemsPerPage));

	const paginatedItems = $derived.by(() => {
		const start = currentPage * options.itemsPerPage;
		const end = start + options.itemsPerPage;
		return options.trackReferences.slice(start, end);
	});

	function nextPage() {
		if (currentPage < totalPages - 1) {
			currentPage++;
		}
	}

	function prevPage() {
		if (currentPage > 0) {
			currentPage--;
		}
	}

	function setPage(page: number) {
		if (page >= 0 && page < totalPages) {
			currentPage = page;
		}
	}

	return {
		get currentPage() {
			return currentPage;
		},
		get totalPages() {
			return totalPages;
		},
		get paginatedItems() {
			return paginatedItems;
		},
		nextPage,
		prevPage,
		setPage
	};
}
