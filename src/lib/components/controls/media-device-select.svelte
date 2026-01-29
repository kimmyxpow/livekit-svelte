<script lang="ts">
	import type { Room } from 'livekit-client';
	import { useMediaDeviceSelect } from '../../hooks/use-media-device-select.svelte.js';
	import { ensureRoom } from '../../context/room-context.svelte.js';

	interface Props {
		kind: MediaDeviceKind;
		class?: string;
		requestPermissions?: boolean;
		room?: Room;
	}

	let { kind, class: className = '', requestPermissions = true, room }: Props = $props();

	const { devices, activeDeviceId } = useMediaDeviceSelect(
		() => ({ kind, requestPermissions }),
		() => room
	);

	async function handleChange(event: Event) {
		const r = ensureRoom(room);
		const select = event.target as HTMLSelectElement;
		const deviceId = select.value;

		switch (kind) {
			case 'audioinput':
				await r.switchActiveDevice('audioinput', deviceId);
				break;
			case 'videoinput':
				await r.switchActiveDevice('videoinput', deviceId);
				break;
			case 'audiooutput':
				await r.switchActiveDevice('audiooutput', deviceId);
				break;
		}
	}
</script>

<select class="lk-media-device-select {className}" onchange={handleChange} value={activeDeviceId}>
	{#each devices as device (device.deviceId)}
		<option value={device.deviceId}
			>{device.label || `${kind} ${devices.indexOf(device) + 1}`}</option
		>
	{/each}
</select>

<style>
	.lk-media-device-select {
		padding: 8px 12px;
		border-radius: 4px;
		border: 1px solid #555;
		background: #333;
		color: white;
		cursor: pointer;
		min-width: 150px;
	}

	.lk-media-device-select:focus {
		outline: none;
		border-color: #0a84ff;
	}
</style>
