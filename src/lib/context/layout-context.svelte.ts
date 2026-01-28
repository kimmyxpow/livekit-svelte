import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';
import type { PinState, WidgetState } from '@livekit/components-core';
import { LAYOUT_CONTEXT_KEY } from './keys.js';

export interface LayoutContext {
	pin: Writable<PinState>;
	widget: Writable<WidgetState>;
}

export function createLayoutContext(): LayoutContext {
	return {
		pin: writable<PinState>([]),
		widget: writable<WidgetState>({ showChat: false, unreadMessages: 0 })
	};
}

export function setLayoutContext(context: LayoutContext): void {
	setContext(LAYOUT_CONTEXT_KEY, context);
}

export function getLayoutContext(): LayoutContext | undefined {
	return getContext<LayoutContext>(LAYOUT_CONTEXT_KEY);
}

export function ensureLayoutContext(): LayoutContext {
	const ctx = getLayoutContext();
	if (!ctx) {
		throw new Error(
			'No layout context found. Make sure the component is inside a LayoutContextProvider or VideoConference component.'
		);
	}
	return ctx;
}
