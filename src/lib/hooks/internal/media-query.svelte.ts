export function useMediaQuery(query: string): boolean {
	let matches = $state<boolean>(false);

	$effect(() => {
		if (typeof window === 'undefined') return;

		const mediaQuery = window.matchMedia(query);
		matches = mediaQuery.matches;

		const handler = (event: MediaQueryListEvent) => {
			matches = event.matches;
		};

		mediaQuery.addEventListener('change', handler);

		return () => {
			mediaQuery.removeEventListener('change', handler);
		};
	});

	return matches;
}

export function useIsMobile(): boolean {
	return useMediaQuery('(max-width: 768px)');
}

export function useIsTablet(): boolean {
	return useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
}

export function useIsDesktop(): boolean {
	return useMediaQuery('(min-width: 1025px)');
}

export function usePrefersReducedMotion(): boolean {
	return useMediaQuery('(prefers-reduced-motion: reduce)');
}

export function usePrefersDarkMode(): boolean {
	return useMediaQuery('(prefers-color-scheme: dark)');
}
