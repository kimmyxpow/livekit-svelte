import { warnAboutMissingStyles } from '../utils.js';

/**
 * @internal
 */
export function useWarnAboutMissingStyles() {
	$effect(() => {
		warnAboutMissingStyles();
	});
}
