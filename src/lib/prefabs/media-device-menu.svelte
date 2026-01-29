<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LocalAudioTrack, LocalVideoTrack } from 'livekit-client';
	import MediaDeviceSelect from '../components/controls/media-device-select.svelte';

	interface Props {
		kind?: MediaDeviceKind;
		initialSelection?: string;
		onActiveDeviceChange?: (kind: MediaDeviceKind, deviceId: string) => void;
		tracks?: Partial<Record<MediaDeviceKind, LocalAudioTrack | LocalVideoTrack | undefined>>;
		requestPermissions?: boolean;
		class?: string;
		children?: Snippet;
	}

	let {
		kind,
		initialSelection: _initialSelection,
		onActiveDeviceChange: _onActiveDeviceChange,
		tracks: _tracks,
		requestPermissions = false,
		class: className = '',
		children
	}: Props = $props();

	let isOpen = $state(false);
	const needPermissions = $derived(isOpen || requestPermissions);

	function toggleMenu() {
		isOpen = !isOpen;
	}

	function handleClickOutside(event: MouseEvent) {
		const button = document.querySelector('.lk-media-device-menu-button');
		const tooltip = document.querySelector('.lk-device-menu');
		if (!tooltip || event.target === button) return;
		if (isOpen && !tooltip.contains(event.target as Node)) {
			isOpen = false;
		}
	}

	$effect(() => {
		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});
</script>

<button
	class="lk-button lk-button-menu lk-media-device-menu-button {className}"
	aria-pressed={isOpen}
	onclick={toggleMenu}
>
	{@render children?.()}
</button>

{#if isOpen}
	<div class="lk-device-menu" style:visibility={isOpen ? 'visible' : 'hidden'}>
		{#if kind}
			<MediaDeviceSelect {kind} requestPermissions={needPermissions} />
		{:else}
			<div class="lk-device-menu-heading">Audio inputs</div>
			<MediaDeviceSelect kind="audioinput" requestPermissions={needPermissions} />
			<div class="lk-device-menu-heading">Video inputs</div>
			<MediaDeviceSelect kind="videoinput" requestPermissions={needPermissions} />
		{/if}
	</div>
{/if}

<style>
	.lk-button {
		padding: 8px 16px;
		border-radius: 4px;
		border: none;
		background: #444;
		color: white;
		cursor: pointer;
		transition: background 0.2s;
	}

	.lk-button:hover {
		background: #555;
	}

	.lk-device-menu {
		position: absolute;
		background: #2a2a2a;
		border-radius: 8px;
		padding: 12px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
		z-index: 100;
		min-width: 200px;
	}

	.lk-device-menu-heading {
		font-weight: 600;
		font-size: 12px;
		text-transform: uppercase;
		color: #888;
		margin: 12px 0 8px;
	}

	.lk-device-menu-heading:first-child {
		margin-top: 0;
	}
</style>
