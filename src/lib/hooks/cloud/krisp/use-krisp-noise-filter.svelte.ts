import { LocalAudioTrack } from 'livekit-client';
import { log } from '@livekit/components-core';
import type { KrispNoiseFilterProcessor, NoiseFilterOptions } from '@livekit/krisp-noise-filter';
import type { TrackReferenceOrPlaceholder } from '@livekit/components-core';
import { useLocalParticipant } from '../../use-local-participant.svelte.js';

/**
 * @beta
 */
export interface UseKrispNoiseFilterOptions {
	/**
	 * The track reference to use for the noise filter (defaults: local microphone track)
	 */
	trackRef?: TrackReferenceOrPlaceholder;
	/**
	 * @internal
	 */
	filterOptions?: NoiseFilterOptions;
}

/**
 * Enable the Krisp enhanced noise cancellation feature for local audio tracks.
 *
 * Defaults to the localParticipant's microphone track publication, but you can override this behavior by passing in a different track reference.
 *
 * @package @livekit/components-svelte/krisp
 * @remarks This filter requires that you install the `@livekit/krisp-noise-filter` package and is supported only on {@link https://cloud.livekit.io | LiveKit Cloud}.
 * @beta
 * @example
 * ```svelte
 * const krisp = useKrispNoiseFilter();
 * ```
 * @returns Use `setIsNoiseFilterEnabled` to enable/disable the noise filter.
 */
export function useKrispNoiseFilter(options: UseKrispNoiseFilterOptions = {}) {
	let shouldEnable = $state(false);
	let isNoiseFilterPending = $state(false);
	let isNoiseFilterEnabled = $state(false);
	let krispProcessor = $state<KrispNoiseFilterProcessor | undefined>(undefined);

	const localParticipant = useLocalParticipant();
	let micPublication = localParticipant.microphoneTrack;

	if (options.trackRef) {
		micPublication = options.trackRef.publication;
	}

	const setNoiseFilterEnabled = async (enable: boolean) => {
		if (enable) {
			const { KrispNoiseFilter, isKrispNoiseFilterSupported } =
				await import('@livekit/krisp-noise-filter');

			if (!isKrispNoiseFilterSupported()) {
				log.warn('LiveKit-Krisp noise filter is not supported in this browser');
				return;
			}
			if (!krispProcessor) {
				krispProcessor = KrispNoiseFilter(options.filterOptions);
			}
		}
		if (shouldEnable !== enable) {
			isNoiseFilterPending = true;
		}
		shouldEnable = enable;
	};

	$effect(() => {
		if (micPublication && micPublication.track instanceof LocalAudioTrack && krispProcessor) {
			const currentProcessor = micPublication.track.getProcessor();
			if (currentProcessor && currentProcessor.name === 'livekit-noise-filter') {
				isNoiseFilterPending = true;
				(currentProcessor as KrispNoiseFilterProcessor).setEnabled(shouldEnable).finally(() => {
					isNoiseFilterPending = false;
					isNoiseFilterEnabled = shouldEnable;
				});
			} else if (!currentProcessor && shouldEnable) {
				isNoiseFilterPending = true;
				micPublication?.track
					?.setProcessor(krispProcessor)
					.then(() => krispProcessor!.setEnabled(true))
					.then(() => {
						isNoiseFilterEnabled = true;
					})
					.catch((e: unknown) => {
						isNoiseFilterEnabled = false;
						log.error('Krisp hook: error enabling filter', e);
					})
					.finally(() => {
						isNoiseFilterPending = false;
					});
			}
		}
	});

	return {
		setNoiseFilterEnabled,
		isNoiseFilterEnabled,
		isNoiseFilterPending,
		processor: krispProcessor
	};
}
