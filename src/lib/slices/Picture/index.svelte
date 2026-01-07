<script lang="ts">
	import { slideIn } from '$lib/actions/slide-in';
	import { getSceneAttributes } from '$lib/utils/get-scene-attributes';
	import { isFilled, type Content } from '@prismicio/client';
	import { PrismicImage, PrismicRichText, type SliceComponentProps } from '@prismicio/svelte';
	import clsx from 'clsx';

	type Props = SliceComponentProps<Content.PictureSlice>;

	const { slice }: Props = $props();
</script>

<section
	data-slice-type={slice.slice_type}
	data-slice-variation={slice.variation}
	{...getSceneAttributes({
		position: 'top',
		model: isFilled.contentRelationship(slice.primary.product)
			? slice.primary.product.uid
			: undefined
	})}
	class="grid xl:grid-cols-[3fr_2fr]"
>
	<figure class="contents">
		<PrismicImage field={slice.primary.picture} loading="lazy" class="z-20 row-span-2 w-full" />
		<figcaption
			use:slideIn
			class={clsx(
				'px-4 pt-4 pb-16 rich-text',
				slice.variation === 'default' || (slice.variation === 'bottom' && 'self-start'),
				slice.variation === 'top' && 'xl:self-end xl:order-last'
			)}
		>
			<PrismicRichText field={slice.primary.caption} />
		</figcaption>
	</figure>
	{#if isFilled.image(slice.primary.secondary_picture)}
		<figure
			class={clsx(
				'flex flex-col',
				(slice.variation === 'default' || slice.variation === 'bottom') && 'self-end',
				slice.variation === 'top' && 'xl:order-start'
			)}
		>
			<PrismicImage field={slice.primary.secondary_picture} loading="lazy" class="z-20 w-full" />
			<figcaption
				use:slideIn
				class={clsx('px-4 pt-4 pb-16 rich-text', slice.variation === 'bottom' && 'xl:order-first')}
			>
				<PrismicRichText field={slice.primary.secondary_caption} />
			</figcaption>
		</figure>
	{/if}
</section>
