import { getContext, setContext } from 'svelte';
import { FEATURE_CONTEXT_KEY } from './keys.js';

/** @internal */
export interface FeatureFlags {
	/** @internal */
	autoSubscription?: boolean;
}

export interface FeatureContextValue {
	/** @internal */
	autoSubscription?: boolean;
}

export function createFeatureContext(flags: FeatureFlags = {}): FeatureContextValue {
	return {
		autoSubscription: flags.autoSubscription
	};
}

export function setFeatureContext(context: FeatureContextValue): void {
	setContext(FEATURE_CONTEXT_KEY, context);
}

export function getFeatureContext(): FeatureContextValue | undefined {
	return getContext<FeatureContextValue>(FEATURE_CONTEXT_KEY);
}

export function ensureFeatureContext(): FeatureContextValue {
	const ctx = getFeatureContext();
	if (!ctx) {
		throw new Error('No feature context found.');
	}
	return ctx;
}
