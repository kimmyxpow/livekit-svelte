import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';
import type { PinState, WidgetState, TrackReferenceOrPlaceholder } from '@livekit/components-core';
import { LAYOUT_CONTEXT_KEY } from './keys.js';

/** @internal */
export type PinAction =
	| { msg: 'set_pin'; trackReference: TrackReferenceOrPlaceholder }
	| { msg: 'clear_pin' };

/** @internal */
export type ChatContextAction =
	| { msg: 'show_chat' }
	| { msg: 'hide_chat' }
	| { msg: 'toggle_chat' }
	| { msg: 'unread_msg'; count: number }
	| { msg: 'toggle_settings' };

export interface PinContextType {
	dispatch?: (action: PinAction) => void;
	state?: Writable<PinState>;
}

export interface WidgetContextType {
	dispatch?: (action: ChatContextAction) => void;
	state?: Writable<WidgetState>;
}

export interface LayoutContext {
	pin: PinContextType;
	widget: WidgetContextType;
}

function pinReducer(state: PinState, action: PinAction): PinState {
	if (action.msg === 'set_pin') {
		return [action.trackReference];
	} else if (action.msg === 'clear_pin') {
		return [];
	}
	return state;
}

function chatReducer(state: WidgetState, action: ChatContextAction): WidgetState {
	if (action.msg === 'show_chat') {
		return { ...state, showChat: true, unreadMessages: 0 };
	} else if (action.msg === 'hide_chat') {
		return { ...state, showChat: false };
	} else if (action.msg === 'toggle_chat') {
		const newState = { ...state, showChat: !state.showChat };
		if (newState.showChat === true) {
			newState.unreadMessages = 0;
		}
		return newState;
	} else if (action.msg === 'unread_msg') {
		return { ...state, unreadMessages: action.count };
	} else if (action.msg === 'toggle_settings') {
		return { ...state, showSettings: !state.showSettings };
	}
	return state;
}

export function createLayoutContext(): LayoutContext {
	const pinStore = writable<PinState>([]);
	const widgetStore = writable<WidgetState>({ showChat: false, unreadMessages: 0 });

	return {
		pin: {
			state: pinStore,
			dispatch: (action: PinAction) => {
				pinStore.update((s) => {
					const newState = pinReducer(s, action);
					return newState;
				});
			}
		},
		widget: {
			state: widgetStore,
			dispatch: (action: ChatContextAction) => {
				widgetStore.update((s) => {
					const newState = chatReducer(s, action);
					return newState;
				});
			}
		}
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

export function useMaybeLayoutContext(): LayoutContext | undefined {
	return getLayoutContext();
}
