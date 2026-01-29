import type TypedEventEmitter from 'typed-emitter';
import type { EventMap } from 'typed-emitter';

/** @public */
export function useEvents<
	Emitter extends TypedEventEmitter<EventMap>,
	EmitterEventMap extends Emitter extends TypedEventEmitter<infer EM> ? EM : never,
	Event extends Parameters<Emitter['on']>[0],
	Callback extends EmitterEventMap[Event]
>(
	instance: Emitter | { internal: { emitter: Emitter } } | null | undefined,
	event: Event,
	handlerFn: Callback | undefined
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
