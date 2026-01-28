<script lang="ts">
	import type { LocalAudioTrack, LocalVideoTrack } from 'livekit-client';
	import { createLocalAudioTrack, createLocalVideoTrack } from 'livekit-client';
	import { useMediaDevices } from '../hooks/use-media-devices.svelte.js';

	interface Props {
		class?: string;
		onSubmit?: (values: { username: string; audioEnabled: boolean; videoEnabled: boolean }) => void;
		onError?: (error: Error) => void;
	}

	let { class: className = '', onSubmit, onError }: Props = $props();

	let username = $state('');
	let audioEnabled = $state(false);
	let videoEnabled = $state(false);
	let audioTrack = $state<LocalAudioTrack | undefined>(undefined);
	let videoTrack = $state<LocalVideoTrack | undefined>(undefined);
	let videoElement: HTMLVideoElement | undefined = $state(undefined);

	const _audioDevices = useMediaDevices('audioinput', { requestPermissions: true });
	const _videoDevices = useMediaDevices('videoinput', { requestPermissions: true });

	$effect(() => {
		if (videoElement && videoTrack) {
			videoTrack.attach(videoElement);
			return () => {
				if (videoElement) {
					videoTrack?.detach(videoElement);
				}
			};
		}
	});

	async function toggleAudio() {
		try {
			if (audioEnabled) {
				await audioTrack?.stop();
				audioTrack = undefined;
				audioEnabled = false;
			} else {
				audioTrack = await createLocalAudioTrack();
				audioEnabled = true;
			}
		} catch (e) {
			onError?.(e as Error);
		}
	}

	async function toggleVideo() {
		try {
			if (videoEnabled) {
				await videoTrack?.stop();
				videoTrack = undefined;
				videoEnabled = false;
			} else {
				videoTrack = await createLocalVideoTrack();
				videoEnabled = true;
			}
		} catch (e) {
			onError?.(e as Error);
		}
	}

	function handleSubmit(event: Event) {
		event.preventDefault();
		if (!username.trim()) return;

		onSubmit?.({
			username: username.trim(),
			audioEnabled,
			videoEnabled
		});
	}

	function _cleanup() {
		audioTrack?.stop();
		videoTrack?.stop();
	}
</script>

<div class="lk-pre-join {className}">
	<div class="lk-pre-join-preview">
		{#if videoEnabled && videoTrack}
			<video bind:this={videoElement} autoplay playsinline muted></video>
		{:else}
			<div class="lk-pre-join-placeholder">
				<span>Camera off</span>
			</div>
		{/if}
	</div>

	<form class="lk-pre-join-form" onsubmit={handleSubmit}>
		<input type="text" placeholder="Enter your name" bind:value={username} required />

		<div class="lk-pre-join-controls">
			<button type="button" onclick={toggleAudio} class:lk-enabled={audioEnabled}>
				{audioEnabled ? 'Mute' : 'Unmute'}
			</button>
			<button type="button" onclick={toggleVideo} class:lk-enabled={videoEnabled}>
				{videoEnabled ? 'Stop Video' : 'Start Video'}
			</button>
		</div>

		<button type="submit" class="lk-pre-join-submit" disabled={!username.trim()}> Join </button>
	</form>
</div>

<style>
	.lk-pre-join {
		display: flex;
		flex-direction: column;
		gap: 16px;
		padding: 24px;
		background: #1a1a1a;
		border-radius: 12px;
		max-width: 400px;
		width: 100%;
	}

	.lk-pre-join-preview {
		aspect-ratio: 16 / 9;
		background: #2a2a2a;
		border-radius: 8px;
		overflow: hidden;
	}

	.lk-pre-join-preview video {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.lk-pre-join-placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #888;
	}

	.lk-pre-join-form {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.lk-pre-join-form input {
		padding: 12px;
		border-radius: 6px;
		border: 1px solid #444;
		background: #2a2a2a;
		color: white;
		font-size: 14px;
	}

	.lk-pre-join-form input:focus {
		outline: none;
		border-color: #0a84ff;
	}

	.lk-pre-join-controls {
		display: flex;
		gap: 8px;
	}

	.lk-pre-join-controls button {
		flex: 1;
		padding: 10px;
		border-radius: 6px;
		border: none;
		background: #444;
		color: white;
		cursor: pointer;
		font-size: 14px;
		transition: background 0.2s;
	}

	.lk-pre-join-controls button:hover {
		background: #555;
	}

	.lk-pre-join-controls button.lk-enabled {
		background: #0a84ff;
	}

	.lk-pre-join-submit {
		padding: 12px;
		border-radius: 6px;
		border: none;
		background: #0a84ff;
		color: white;
		cursor: pointer;
		font-size: 16px;
		font-weight: 600;
		transition: background 0.2s;
	}

	.lk-pre-join-submit:hover:not(:disabled) {
		background: #0066cc;
	}

	.lk-pre-join-submit:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
