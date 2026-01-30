<script lang="ts">
	/* eslint-disable svelte/no-useless-children-snippet */
	import { Track, type Room } from 'livekit-client';
	import TrackToggle from '../components/controls/track-toggle.svelte';
	import DisconnectButton from '../components/controls/disconnect-button.svelte';
	import ChatToggle from '../components/controls/chat-toggle.svelte';
	import SettingsMenuToggle from '../components/controls/settings-menu-toggle.svelte';
	import { useMaybeLayoutContext } from '../context/layout-context.svelte.js';

	export type ControlBarControls = {
		microphone?: boolean;
		camera?: boolean;
		chat?: boolean;
		screenShare?: boolean;
		leave?: boolean;
		settings?: boolean;
	};

	interface Props {
		room?: Room;
		class?: string;
		variation?: 'minimal' | 'verbose' | 'textOnly';
		controls?: ControlBarControls;
	}

	let { room, class: className = '', variation = 'minimal', controls }: Props = $props();

	const layoutContext = useMaybeLayoutContext();

	if (layoutContext?.widget.state) {
		$effect(() => {
			const unsubscribe = layoutContext.widget.state!.subscribe(() => {
				// Subscription keeps component reactive to widget state changes
			});
			return unsubscribe;
		});
	}

	const visibleControls = $derived({ leave: true, ...controls });
</script>

<div class="lk-control-bar {className}">
	{#if visibleControls.microphone !== false}
		<TrackToggle source={Track.Source.Microphone}>
			{#snippet children()}
				{variation === 'verbose' || variation === 'textOnly' ? 'Microphone' : ''}
			{/snippet}
		</TrackToggle>
	{/if}
	{#if visibleControls.camera !== false}
		<TrackToggle source={Track.Source.Camera}>
			{#snippet children()}
				{variation === 'verbose' || variation === 'textOnly' ? 'Camera' : ''}
			{/snippet}
		</TrackToggle>
	{/if}
	{#if visibleControls.screenShare !== false}
		<TrackToggle source={Track.Source.ScreenShare}>
			{#snippet children(enabled)}
				{variation === 'verbose' || variation === 'textOnly'
					? enabled
						? 'Stop screen share'
						: 'Share screen'
					: ''}
			{/snippet}
		</TrackToggle>
	{/if}
	{#if visibleControls.chat}
		<ChatToggle>
			{#snippet children(showChat)}
				{variation === 'verbose' || variation === 'textOnly'
					? showChat
						? 'Hide Chat'
						: 'Chat'
					: ''}
			{/snippet}
		</ChatToggle>
	{/if}
	{#if visibleControls.settings}
		<SettingsMenuToggle>
			{#snippet children()}
				{variation === 'verbose' || variation === 'textOnly' ? 'Settings' : ''}
			{/snippet}
		</SettingsMenuToggle>
	{/if}
	{#if visibleControls.leave !== false}
		<DisconnectButton {room}>
			{#snippet children()}
				{variation === 'verbose' || variation === 'textOnly' ? 'Leave' : ''}
			{/snippet}
		</DisconnectButton>
	{/if}
</div>

<style>
	.lk-control-bar {
		display: flex;
		gap: 8px;
		padding: 12px;
		background: #1a1a1a;
		border-radius: 8px;
		justify-content: center;
		align-items: center;
	}
</style>
