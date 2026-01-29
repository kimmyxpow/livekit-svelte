// Simple event emitter interface matching typed-emitter
interface EventEmitter<T extends Record<string, unknown>> {
	on<K extends keyof T>(event: K, listener: T[K]): this;
	off<K extends keyof T>(event: K, listener: T[K]): this;
}

type EventMap = Record<string, unknown>;

/** @public */
export function useEvents<EM extends EventMap, E extends EventEmitter<EM>, K extends keyof EM>(
	instance: E | { internal: { emitter: E } } | null | undefined,
	event: K,
	handlerFn: EM[K] | undefined
) {
	const emitter = !instance ? null : 'internal' in instance ? instance.internal.emitter : instance;

	$effect(() => {
		if (!emitter || !handlerFn) {
			return;
		}
		emitter.on(event, handlerFn);
		return () => {
			emitter.off(event, handlerFn);
		};
	});
}
