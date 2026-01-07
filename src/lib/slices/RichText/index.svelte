<script lang="ts">
	import { slideIn } from '$lib/actions/slide-in';
	import { getSceneAttributes } from '$lib/utils/get-scene-attributes';
	import { isFilled, type Content } from '@prismicio/client';
	import { PrismicLink, PrismicRichText, type SliceComponentProps } from '@prismicio/svelte';
	import clsx from 'clsx';

	type Props = SliceComponentProps<Content.RichTextSlice>;

	const { slice }: Props = $props();
</script>

<section
	use:slideIn
	{...getSceneAttributes({
		position: 'center',
		model: isFilled.contentRelationship(slice.primary.product)
			? slice.primary.product.uid
			: undefined
	})}
	class={clsx(
		'flex flex-col justify-center bounded rich-text',
		slice.variation === 'fullscreen' ? 'min-h-screen opacity-0' : 'min-h-[40vh]'
	)}
>
	<PrismicRichText field={slice.primary.title} />
	<PrismicRichText field={slice.primary.text} />

	{#if slice.primary.ctas.length > 0}
		<div class="flex mt-16 -ml-4">
			{#each slice.primary.ctas as link (link.key)}
				<PrismicLink field={link} class={clsx('cta', link.variant?.toLowerCase())} />
			{/each}
		</div>
	{/if}
</section>
