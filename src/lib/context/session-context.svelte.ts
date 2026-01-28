import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';
import { SESSION_CONTEXT_KEY } from './keys.js';

export interface AgentState {
	name: string;
	state: 'connecting' | 'connected' | 'disconnected';
}

export interface SessionContextValue {
	agent: Writable<AgentState | undefined>;
	isAgentConnected: Writable<boolean>;
}

export function createSessionContext(): SessionContextValue {
	return {
		agent: writable<AgentState | undefined>(undefined),
		isAgentConnected: writable<boolean>(false)
	};
}

export function setSessionContext(context: SessionContextValue): void {
	setContext(SESSION_CONTEXT_KEY, context);
}

export function getSessionContext(): SessionContextValue | undefined {
	return getContext<SessionContextValue>(SESSION_CONTEXT_KEY);
}

export function ensureSessionContext(): SessionContextValue {
	const ctx = getSessionContext();
	if (!ctx) {
		throw new Error(
			'No session context found. Make sure the component is inside a SessionProvider component.'
		);
	}
	return ctx;
}
