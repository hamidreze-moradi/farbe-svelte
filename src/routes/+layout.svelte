<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import Footer from '$lib/components/footer.svelte';
	import Header from '$lib/components/header.svelte';
	import Scene from '$lib/components/scene.svelte';
	import { repositoryName } from '$lib/prismicio';
	import { cart } from '$lib/stores/cart';
	import '@fontsource-variable/geist-mono';
	import '@fontsource-variable/inter';
	import { PrismicPreview } from '@prismicio/svelte/kit';
	import { Canvas } from '@threlte/core';
	import clsx from 'clsx';
	import { onMount } from 'svelte';
	import { SvelteURL } from 'svelte/reactivity';
	import './layout.css';

	let { children, data } = $props();

	let mounted = $state(false);

	onMount(() => {
		if (page.url.searchParams.get('order') === 'completed') {
			cart.clear();

			const url = new SvelteURL(page.url);
			url.search = '';
			goto(resolve(url.pathname), { replaceState: true });
		}

		mounted = true;
	});
</script>

<svelte:head>
	<title>{page.data.title}</title>
	{#if page.data.meta_description}
		<meta name="description" content={page.data.meta_description} />
	{/if}
	{#if page.data.meta_title}
		<meta name="og:title" content={page.data.meta_title} />
	{/if}
	{#if page.data.meta_image}
		<meta name="og:image" content={page.data.meta_image} />
		<meta name="twitter:card" content="summary_large_image" />
	{/if}
</svelte:head>

<Header settings={data.settings} class="top-0 right-0 left-0 z-10 fixed" />
<main>
	{@render children()}
</main>
<Footer settings={data.settings} />

<div
	class={clsx(
		'top-0 right-0 left-0 -z-10 fixed h-lvh transition-opacity duration-1000 delay-300',
		mounted || 'opacity-0'
	)}
>
	<Canvas>
		<Scene />
	</Canvas>
</div>

<PrismicPreview {repositoryName} />
