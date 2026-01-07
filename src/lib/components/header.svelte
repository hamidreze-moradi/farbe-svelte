<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Content } from '@prismicio/client';
	import { PrismicLink } from '@prismicio/svelte';
	import clsx from 'clsx';
	import BrandSignuture from './brand-signuture.svelte';
	import { cart } from '$lib/stores/cart';
	import { browser } from '$app/environment';

	interface Props {
		settings?: Content.SettingsDocumentData;
		class?: string;
	}

	let { settings, class: className }: Props = $props();

	const { totalItems } = cart;
</script>

<header class={clsx(className)}>
	<nav class="flex justify-between">
		<a href={resolve('/')} class="ml-4 py-mx cta">
			<BrandSignuture class="text-lg" />
		</a>

		{#if settings?.navigation}
			<ul class="flex items-center backdrop-blur pr-4 pl-8 xl:w-[calc(40%+2rem)]">
				{#each settings.navigation as link (link.key)}
					<li class="hidden xl:block">
						<PrismicLink field={link} class="cta" />
					</li>
				{/each}

				<li class="ml-auto">
					<a href={resolve('/#cart')} class="cta"
						>Cart ({#if browser}{$totalItems}{:else}0{/if})
					</a>
				</li>
			</ul>
		{/if}
	</nav>
</header>

<style lang="postcss">
	@reference "tailwindcss";

	header :global(a) {
		@apply transition-opacity duration-300 ease-in-out;
	}

	header:has(:global(a:hover)) :global(a:not(:hover)) {
		@apply opacity-25;
	}
</style>
