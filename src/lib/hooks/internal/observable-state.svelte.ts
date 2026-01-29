import type { Observable, Subscription } from 'rxjs';

export function useObservableState<T>(
	observable: Observable<T> | undefined | (() => Observable<T> | undefined),
	startWith: T
): T {
	let state = $state<T>(startWith);
	let subscription: Subscription | undefined;

	$effect(() => {
		const obs = typeof observable === 'function' ? observable() : observable;
		if (!obs || typeof window === 'undefined') return;

		subscription = obs.subscribe({
			next: (value) => {
				state = value;
			}
		});

		return () => {
			subscription?.unsubscribe();
		};
	});

	return state;
}

export function useObservableStateUndefined<T>(
	observable: Observable<T> | undefined | (() => Observable<T> | undefined)
): T | undefined {
	let state = $state<T | undefined>(undefined);
	let subscription: Subscription | undefined;

	$effect(() => {
		const obs = typeof observable === 'function' ? observable() : observable;
		if (!obs || typeof window === 'undefined') return;

		subscription = obs.subscribe({
			next: (value) => {
				state = value;
			}
		});

		return () => {
			subscription?.unsubscribe();
		};
	});

	return state;
}
