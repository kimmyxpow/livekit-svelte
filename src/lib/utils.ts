import type { TrackReference, TrackReferenceOrPlaceholder } from '@livekit/components-core';
import clsx from 'clsx';

/**
 * Calls all functions in the order they were chained with the same arguments.
 * @internal
 */
export function chain(...callbacks: unknown[]): (...args: unknown[]) => void {
	return (...args: unknown[]) => {
		for (const callback of callbacks) {
			if (typeof callback === 'function') {
				try {
					callback(...args);
				} catch (e) {
					console.error(e);
				}
			}
		}
	};
}

interface Props {
	[key: string]: unknown;
}

type TupleTypes<T> = { [P in keyof T]: T[P] } extends { [key: number]: infer V } ? V : never;
type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (
	k: infer I
) => void
	? I
	: never;

/**
 * Merges multiple props objects together. Event handlers are chained,
 * classNames are combined, and ids are deduplicated - different ids
 * will trigger a side-effect and re-render components hooked up with `useId`.
 * For all other props, the last prop object overrides all previous ones.
 * @param args - Multiple sets of props to merge together.
 * @internal
 */
export function mergeProps<T extends Props[]>(...args: T): UnionToIntersection<TupleTypes<T>> {
	const result: Props = { ...args[0] };
	for (let i = 1; i < args.length; i++) {
		const props = args[i];
		for (const key in props) {
			const a = result[key];
			const b = props[key];

			// Chain events
			if (
				typeof a === 'function' &&
				typeof b === 'function' &&
				key[0] === 'o' &&
				key[1] === 'n' &&
				key.charCodeAt(2) >= 65 &&
				key.charCodeAt(2) <= 90
			) {
				result[key] = chain(a, b);
			} else if (
				(key === 'className' || key === 'class' || key === 'UNSAFE_className') &&
				typeof a === 'string' &&
				typeof b === 'string'
			) {
				result[key] = clsx(a, b);
			} else {
				result[key] = b !== undefined ? b : a;
			}
		}
	}

	return result as UnionToIntersection<TupleTypes<T>>;
}

/**
 * @internal
 */
export function isProp<_U extends HTMLElement, T extends Record<string, unknown>>(
	prop: T | undefined
): prop is T {
	return prop !== undefined;
}

/**
 * @internal
 */
export function cloneSingleChild(
	children: unknown,
	props?: Record<string, unknown>,
	key?: unknown
): unknown {
	if (children && typeof children === 'object' && 'props' in children) {
		const child = children as { props: { className?: string; style?: Record<string, unknown> } };
		if (child.props.className) {
			props ??= {};
			props.className = clsx(child.props.className, props.className);
			props.style = { ...child.props.style, ...props.style };
		}
		return { ...child, ...props, key };
	}
	return children;
}

/**
 * @internal
 */
export function warnAboutMissingStyles(el?: HTMLElement) {
	if (
		typeof window !== 'undefined' &&
		typeof process !== 'undefined' &&
		(process?.env?.NODE_ENV === 'dev' || process?.env?.NODE_ENV === 'development')
	) {
		const target = el ?? document.querySelector('.lk-room-container');
		if (target && !getComputedStyle(target).getPropertyValue('--lk-has-imported-styles')) {
			console.warn(
				"It looks like you're not using the `@livekit/components-styles package`. To render the UI with the default styling, please import it in your layout or page."
			);
		}
	}
}

/**
 * @internal
 */
export function roomOptionsStringifyReplacer(key: string, val: unknown) {
	if (key === 'processor' && val && typeof val === 'object' && 'name' in val) {
		return val.name;
	}
	if (key === 'e2ee' && val) {
		return 'e2ee-enabled';
	}
	return val;
}

export function isTrackReference(
	trackRef: TrackReferenceOrPlaceholder
): trackRef is TrackReference {
	return 'publication' in trackRef && trackRef.publication !== undefined;
}

export function getTrackReferenceId(trackRef: TrackReferenceOrPlaceholder): string {
	return `${trackRef.participant.identity}-${trackRef.source}`;
}

export function sortTrackReferences(
	trackRefs: TrackReferenceOrPlaceholder[]
): TrackReferenceOrPlaceholder[] {
	return [...trackRefs].sort((a, b) => {
		// Screen share tracks come first
		if (a.source === 'screen_share' && b.source !== 'screen_share') return -1;
		if (b.source === 'screen_share' && a.source !== 'screen_share') return 1;

		// Local participant comes before remote
		if (a.participant.isLocal && !b.participant.isLocal) return -1;
		if (b.participant.isLocal && !a.participant.isLocal) return 1;

		// Sort by identity
		return a.participant.identity.localeCompare(b.participant.identity);
	});
}
