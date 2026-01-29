<script lang="ts">
	import type { Snippet } from 'svelte';
	import { useConnectionQualityIndicator } from '../../hooks/use-connection-quality-indicator.svelte.js';
	import { getConnectionQualityIcon } from '../../assets/icons/util.js';

	interface Props {
		class?: string;
		children?: Snippet;
	}

	let { class: className = '', children }: Props = $props();

	const { className: hookClassName, quality } = useConnectionQualityIndicator();
</script>

<div class="{hookClassName} {className}" data-lk-quality={quality}>
	{#if children}
		{@render children()}
	{:else}
		{@const Icon = getConnectionQualityIcon(quality)}
		<Icon />
	{/if}
</div>
