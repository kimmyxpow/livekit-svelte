import { getContext, setContext } from 'svelte';
import { SESSION_CONTEXT_KEY } from './keys.js';
import type { UseSessionReturn } from '../hooks/use-session.svelte.js';

/**
 * @beta
 */
export type SessionContextValue = UseSessionReturn;

/**
 * @beta
 */
export function createSessionContext(session: UseSessionReturn): SessionContextValue {
	return session;
}

/**
 * Sets the session context.
 * @beta
 */
export function setSessionContext(context: SessionContextValue): void {
	setContext(SESSION_CONTEXT_KEY, context);
}

/**
 * Gets the session context if it exists.
 * @beta
 */
export function getSessionContext(): SessionContextValue | undefined {
	return getContext<SessionContextValue>(SESSION_CONTEXT_KEY);
}

/**
 * Ensures that a session is provided via context.
 * If no session is provided, an error is thrown.
 * @beta
 */
export function ensureSessionContext(): SessionContextValue {
	const ctx = getSessionContext();
	if (!ctx) {
		throw Error('tried to access session context outside of SessionProvider component');
	}
	return ctx;
}
