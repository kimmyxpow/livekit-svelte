import { participantAttributesObserver } from '@livekit/components-core';
import type { Participant } from 'livekit-client';
import { useObservableState } from './internal/observable-state.svelte.js';
import { getParticipantContext, ensureParticipant } from '../context/participant-context.svelte.js';

/**
 * The `useParticipantAttributes` hook returns the attributes of a given participant and allows to set them.
 * It requires a `Participant` object passed as property or via the `ParticipantContext`.
 *
 * @example
 * ```svelte
 * const { attributes } = useParticipantAttributes({ participant });
 * ```
 * @public
 */
export interface UseParticipantAttributesOptions {
	participant?: Participant;
}

/** @public */
export function useParticipantAttributes(props: UseParticipantAttributesOptions = {}) {
	const participantContext = getParticipantContext();
	const p = props.participant ?? participantContext ?? undefined;
	const attributeObserver = p ? participantAttributesObserver(p) : undefined;
	const attributeState = useObservableState(attributeObserver, {
		attributes: p?.attributes ?? {},
		changed: {}
	});

	return attributeState;
}

/**
 * The `useParticipantAttribute` hook returns the latest value of a given attribute key of a participant.
 * It requires a `Participant` object passed as property in the `UseParticipantAttributesOptions` or via the `ParticipantContext`.
 *
 * @example
 * ```svelte
 * const myAttributeValue = useParticipantAttribute('targetAttributeName');
 * ```
 * @public
 */
export function useParticipantAttribute(
	attributeKey: string,
	options: UseParticipantAttributesOptions = {}
) {
	const p = ensureParticipant(options.participant);

	const attributeObserver = participantAttributesObserver(p);
	const initialValue = p.attributes[attributeKey];
	const attributeState = useObservableState(attributeObserver, {
		attributes: p.attributes,
		changed: {}
	});

	return attributeState.changed[attributeKey] !== undefined
		? attributeState.attributes[attributeKey]
		: initialValue;
}
