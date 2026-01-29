/**
 * @alpha
 */
export type UseSwipeOptions = {
	minSwipeDistance?: number;
	onLeftSwipe?: () => void;
	onRightSwipe?: () => void;
};

/**
 * Simple implementation to detect horizontal swipe actions.
 * Accepts callbacks for on right and left swipes.
 * @example
 * ```svelte
 * <div
 *   ontouchstart={onTouchStart}
 *   ontouchmove={onTouchMove}
 *   ontouchend={onTouchEnd}
 * >
 * ```
 * @alpha
 */
export function useSwipe(element: HTMLElement | undefined, options: UseSwipeOptions = {}) {
	let touchStart: number | null = null;
	let touchEnd: number | null = null;

	// The required distance between touchStart and touchEnd to be detected as a swipe.
	const minSwipeDistance = options.minSwipeDistance ?? 50;

	const onTouchStart = (event: TouchEvent) => {
		touchEnd = null; // Otherwise the swipe is fired even with usual touch events.
		touchStart = event.targetTouches[0].clientX;
	};

	const onTouchMove = (event: TouchEvent) => {
		touchEnd = event.targetTouches[0].clientX;
	};

	const onTouchEnd = () => {
		if (!touchStart || !touchEnd) {
			return;
		}
		const distance = touchStart - touchEnd;
		const isLeftSwipe = distance > minSwipeDistance;
		const isRightSwipe = distance < -minSwipeDistance;

		if (isLeftSwipe && options.onLeftSwipe) options.onLeftSwipe();
		if (isRightSwipe && options.onRightSwipe) options.onRightSwipe();
	};

	return {
		onTouchStart,
		onTouchMove,
		onTouchEnd
	};
}
