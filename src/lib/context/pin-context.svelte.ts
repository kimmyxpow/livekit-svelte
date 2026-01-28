import { getContext, setContext } from 'svelte';
import type { PinState } from '@livekit/components-core';
import type { Writable } from 'svelte/store';
import { PIN_CONTEXT_KEY } from './keys.js';

export interface PinContextValue {
	pinState: Writable<PinState>;
}

export function setPinContext(context: PinContextValue): void {
	setContext(PIN_CONTEXT_KEY, context);
}

export function getPinContext(): PinContextValue | undefined {
	return getContext<PinContextValue>(PIN_CONTEXT_KEY);
}

export function ensurePinContext(): PinContextValue {
	const ctx = getPinContext();
	if (!ctx) {
		throw new Error(
			'No pin context found. Make sure the component is inside a LayoutContextProvider or VideoConference component.'
		);
	}
	return ctx;
}
