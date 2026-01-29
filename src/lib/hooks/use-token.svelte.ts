import { log } from '@livekit/components-core';

/** @public */
export interface UserInfo {
	identity?: string;
	name?: string;
	metadata?: string;
}

/** @public */
export interface UseTokenOptions {
	userInfo?: UserInfo;
}

/**
 * The `useToken` hook fetches a token from the given token endpoint with the given user info.
 *
 * @example
 * ```svelte
 * const token = useToken(<token-endpoint>, roomName, { userInfo: { identity, name }});
 * ```
 * @public
 */
export function useToken(
	tokenEndpoint: string | undefined,
	roomName: string,
	options: UseTokenOptions = {}
): string | undefined {
	let token = $state<string | undefined>(undefined);

	$effect(() => {
		if (tokenEndpoint === undefined) {
			throw Error('token endpoint needs to be defined');
		}
		if (options.userInfo?.identity === undefined) {
			return;
		}
		const tokenFetcher = async () => {
			log.debug('fetching token');
			// eslint-disable-next-line svelte/prefer-svelte-reactivity
			const params = new URLSearchParams({ ...options.userInfo, roomName } as Record<
				string,
				string
			>);
			const res = await fetch(`${tokenEndpoint}?${params.toString()}`);
			if (!res.ok) {
				log.error(
					`Could not fetch token. Server responded with status ${res.status}: ${res.statusText}`
				);
				return;
			}
			const { accessToken } = await res.json();
			token = accessToken;
		};
		tokenFetcher();
	});

	return token;
}
