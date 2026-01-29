import type { LocalAudioTrack, RemoteAudioTrack, AudioAnalyserOptions } from 'livekit-client';
import { Track, createAudioAnalyser } from 'livekit-client';
import {
	type TrackReference,
	isTrackReference,
	type TrackReferenceOrPlaceholder
} from '@livekit/components-core';

/**
 * @alpha
 * Hook for tracking the volume of an audio track using the Web Audio API.
 */
export function useTrackVolume(
	trackOrTrackReference?: LocalAudioTrack | RemoteAudioTrack | TrackReference,
	options: AudioAnalyserOptions = { fftSize: 32, smoothingTimeConstant: 0 }
): number {
	const track = isTrackReference(trackOrTrackReference)
		? (trackOrTrackReference.publication?.track as LocalAudioTrack | RemoteAudioTrack | undefined)
		: trackOrTrackReference;

	let volume = $state(0);

	$effect(() => {
		if (!track || !track.mediaStream) {
			return;
		}

		const { cleanup, analyser } = createAudioAnalyser(track, options);

		const bufferLength = analyser.frequencyBinCount;
		const dataArray = new Uint8Array(bufferLength);

		const updateVolume = () => {
			analyser.getByteFrequencyData(dataArray);
			let sum = 0;
			for (let i = 0; i < dataArray.length; i++) {
				const a = dataArray[i];
				sum += a * a;
			}
			volume = Math.sqrt(sum / dataArray.length) / 255;
		};

		const interval = setInterval(updateVolume, 1000 / 30);

		return () => {
			cleanup();
			clearInterval(interval);
		};
	});

	return volume;
}

const normalizeFrequencies = (frequencies: Float32Array) => {
	const normalizeDb = (value: number) => {
		const minDb = -100;
		const maxDb = -10;
		let db = 1 - (Math.max(minDb, Math.min(maxDb, value)) * -1) / 100;
		db = Math.sqrt(db);

		return db;
	};

	// Normalize all frequency values
	return frequencies.map((value) => {
		if (value === -Infinity) {
			return 0;
		}
		return normalizeDb(value);
	});
};

/**
 * Interface for configuring options for the useMultibandTrackVolume hook.
 * @alpha
 */
export interface MultiBandTrackVolumeOptions {
	bands?: number;
	/**
	 * cut off of frequency bins on the lower end
	 * Note: this is not a frequency measure, but in relation to analyserOptions.fftSize,
	 */
	loPass?: number;
	/**
	 * cut off of frequency bins on the higher end
	 * Note: this is not a frequency measure, but in relation to analyserOptions.fftSize,
	 */
	hiPass?: number;
	/**
	 * update should run every x ms
	 */
	updateInterval?: number;
	analyserOptions?: AudioAnalyserOptions;
}

const multibandDefaults = {
	bands: 5,
	loPass: 100,
	hiPass: 600,
	updateInterval: 32,
	analyserOptions: { fftSize: 2048 }
} as const satisfies MultiBandTrackVolumeOptions;

/**
 * Hook for tracking the volume of an audio track across multiple frequency bands using the Web Audio API.
 * @alpha
 */
export function useMultibandTrackVolume(
	trackOrTrackReference?: LocalAudioTrack | RemoteAudioTrack | TrackReferenceOrPlaceholder,
	options: MultiBandTrackVolumeOptions = {}
): number[] {
	const track =
		trackOrTrackReference instanceof Track
			? trackOrTrackReference
			: (trackOrTrackReference?.publication?.track as
					| LocalAudioTrack
					| RemoteAudioTrack
					| undefined);
	const opts = { ...multibandDefaults, ...options };

	let frequencyBands = $state<number[]>(new Array(opts.bands).fill(0));

	$effect(() => {
		if (!track || !track?.mediaStream) {
			frequencyBands = new Array(opts.bands).fill(0);
			return;
		}
		const { analyser, cleanup } = createAudioAnalyser(track, opts.analyserOptions);

		const bufferLength = analyser.frequencyBinCount;
		const dataArray = new Float32Array(bufferLength);

		const updateVolume = () => {
			analyser.getFloatFrequencyData(dataArray);
			let frequencies: Float32Array = new Float32Array(dataArray.length);
			for (let i = 0; i < dataArray.length; i++) {
				frequencies[i] = dataArray[i];
			}
			frequencies = frequencies.slice(opts.loPass, opts.hiPass);

			const normalizedFrequencies = normalizeFrequencies(frequencies);
			const totalBins = normalizedFrequencies.length;
			const chunks: Array<number> = [];
			for (let i = 0; i < opts.bands; i++) {
				// Use proportional distribution to evenly divide bins across bands
				const startIndex = Math.floor((i * totalBins) / opts.bands);
				const endIndex = Math.floor(((i + 1) * totalBins) / opts.bands);
				const chunk = normalizedFrequencies.slice(startIndex, endIndex);
				const chunkLength = chunk.length;
				if (chunkLength === 0) {
					chunks.push(0);
				} else {
					const summedVolumes = chunk.reduce((acc, val) => (acc += val), 0);
					chunks.push(summedVolumes / chunkLength);
				}
			}

			frequencyBands = chunks;
		};

		const interval = setInterval(updateVolume, opts.updateInterval);

		return () => {
			cleanup();
			clearInterval(interval);
		};
	});

	return frequencyBands;
}

/**
 * @alpha
 */
export interface AudioWaveformOptions {
	barCount?: number;
	volMultiplier?: number;
	updateInterval?: number;
}

const waveformDefaults = {
	barCount: 120,
	volMultiplier: 5,
	updateInterval: 20
} as const satisfies AudioWaveformOptions;

/**
 * @alpha
 */
export function useAudioWaveform(
	trackOrTrackReference?: LocalAudioTrack | RemoteAudioTrack | TrackReferenceOrPlaceholder,
	options: AudioWaveformOptions = {}
): { bars: number[] } {
	const track =
		trackOrTrackReference instanceof Track
			? trackOrTrackReference
			: (trackOrTrackReference?.publication?.track as
					| LocalAudioTrack
					| RemoteAudioTrack
					| undefined);
	const opts = { ...waveformDefaults, ...options };

	let bars = $state<number[]>([]);

	$effect(() => {
		if (!track || !track?.mediaStream) {
			return;
		}
		const { analyser, cleanup } = createAudioAnalyser(track, {
			fftSize: getFFTSizeValue(opts.barCount)
		});

		const bufferLength = getFFTSizeValue(opts.barCount);
		const dataArray = new Float32Array(bufferLength);

		let aggregateWave = new Float32Array(bufferLength);
		let timeRef = performance.now();
		let updates = 0;

		const update = () => {
			analyser.getFloatTimeDomainData(dataArray);
			aggregateWave = aggregateWave.map((v, i) => v + dataArray[i]);
			updates += 1;

			if (performance.now() - timeRef >= opts.updateInterval) {
				const newData = dataArray.map((v) => v / updates);
				bars = Array.from(
					filterData(newData, opts.barCount).map((v) => Math.sqrt(v) * opts.volMultiplier)
				);
				timeRef = performance.now();
				updates = 0;
				aggregateWave = new Float32Array(bufferLength);
			}
		};

		const updateWaveform = setInterval(update, opts.updateInterval);

		return () => {
			cleanup();
			clearInterval(updateWaveform);
		};
	});

	return { bars };
}

function getFFTSizeValue(x: number): number {
	if (x < 32) return 32;
	else return pow2ceil(x);
}

function pow2ceil(v: number) {
	let p = 2;
	while ((v >>= 1)) {
		p <<= 1;
	}
	return p;
}

function filterData(audioData: Float32Array, numSamples: number) {
	const blockSize = Math.floor(audioData.length / numSamples);
	const filteredData = new Float32Array(numSamples);
	for (let i = 0; i < numSamples; i++) {
		const blockStart = blockSize * i;
		let sum = 0;
		for (let j = 0; j < blockSize; j++) {
			sum = sum + Math.abs(audioData[blockStart + j]);
		}
		filteredData[i] = sum / blockSize;
	}
	return filteredData;
}
