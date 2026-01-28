interface Size {
	width: number;
	height: number;
}

export function useResizeObserver(element: HTMLElement | undefined): Size | undefined {
	let size = $state<Size | undefined>(undefined);

	$effect(() => {
		if (!element || typeof window === 'undefined') return;

		const resizeObserver = new ResizeObserver((entries) => {
			for (const entry of entries) {
				if (entry.contentRect) {
					size = {
						width: entry.contentRect.width,
						height: entry.contentRect.height
					};
				}
			}
		});

		resizeObserver.observe(element);

		// Set initial size
		const rect = element.getBoundingClientRect();
		size = {
			width: rect.width,
			height: rect.height
		};

		return () => {
			resizeObserver.disconnect();
		};
	});

	return size;
}

export function useElementSize(
	element: HTMLElement | undefined | (() => HTMLElement | undefined)
): Size {
	let size = $state<Size>({ width: 0, height: 0 });
	const el = $derived(typeof element === 'function' ? element() : element);

	$effect(() => {
		if (!el || typeof window === 'undefined') return;

		const resizeObserver = new ResizeObserver((entries) => {
			for (const entry of entries) {
				if (entry.contentRect) {
					size = {
						width: entry.contentRect.width,
						height: entry.contentRect.height
					};
				}
			}
		});

		resizeObserver.observe(el);

		// Set initial size
		const rect = el.getBoundingClientRect();
		size = {
			width: rect.width,
			height: rect.height
		};

		return () => {
			resizeObserver.disconnect();
		};
	});

	return size;
}
