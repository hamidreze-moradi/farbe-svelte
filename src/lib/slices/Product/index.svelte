<script lang="ts">
	import { slideIn } from '$lib/actions/slide-in';
	import type { StripeProduct } from '$lib/types/stripe';
	import { formatPrice } from '$lib/utils/format-price';
	import { asText, isFilled, type Content } from '@prismicio/client';
	import { PrismicRichText, PrismicTable, type SliceComponentProps } from '@prismicio/svelte';
	import DescriptionDetails from './description-details.svelte';
	import DescriptionList from './description-list.svelte';
	import DescriptionTerm from './description-term.svelte';
	import Div from './div.svelte';
	import PassThrough from './pass-through.svelte';
	import { cart } from '$lib/stores/cart';
	import clsx from 'clsx';
	import { browser } from '$app/environment';
	import { resolve } from '$app/paths';
	import { getSceneAttributes } from '$lib/utils/get-scene-attributes';

	type Props = SliceComponentProps<
		Content.ProductSlice,
		{ stripeProducts: Record<string, StripeProduct> }
	>;

	const { slice, context }: Props = $props();

	const { items, upsertItem } = cart;

	let product = $derived.by(() => {
		const prismicProduct = slice.primary.product;

		if (!isFilled.contentRelationship(prismicProduct) || !prismicProduct.data?.stripe_id) {
			return undefined;
		}

		const stripeProduct = context.stripeProducts[prismicProduct.data.stripe_id];

		if (!stripeProduct) {
			return undefined;
		}

		return {
			...prismicProduct,
			stripeProduct
		};
	});

	let quantity: number = $state(1);

	function setQuantity(value: number) {
		quantity = Math.max(1, value);
	}

	function onsubmit(e: Event) {
		e.preventDefault();

		if (!product) {
			return;
		}

		const maybeCartQuantity = $items[product.stripeProduct.id]?.quantity ?? 0;

		upsertItem({
			product: product.stripeProduct,
			quantity: maybeCartQuantity + quantity,
			name: asText(product.data?.name) ?? ''
		});

		setQuantity(1);
	}
</script>

{#if product?.data}
	<article
		use:slideIn
		data-slice-type={slice.slice_type}
		data-slice-variation={slice.variation}
		{...getSceneAttributes({ position: 'center', model: product.uid, rotate: true })}
		class="flex flex-col justify-center min-h-[150vh] bounded rich-text"
	>
		<header id={product.uid} class="pt-[25vh] rich-text">
			<PrismicRichText field={product.data.name} />
			<p aria-label="Price">{formatPrice(product.stripeProduct.price.amount)} / rool</p>
		</header>
		<section class="rich-text">
			<h3 class="sr-only">Description</h3>
			<PrismicRichText field={product.data.description} />
		</section>
		<section class="rich-text">
			<h3 class="sr-only">Characteristics</h3>
			<PrismicTable
				field={product.data.characteristics}
				components={{
					table: DescriptionList,
					tbody: PassThrough,
					tr: Div,
					th: DescriptionTerm,
					td: DescriptionDetails
				}}
			/>
		</section>

		<form {onsubmit} class="flex items-start mt-16 -ml-4 max-w-[calc(40ch+1rem)] text-sm">
			<div class="flex flex-1 items-center">
				<button onclick={() => setQuantity(quantity - 1)} type="button" class="cta">-</button>
				<div class="flex-1 text-center">{quantity}</div>
				<button onclick={() => setQuantity(quantity + 1)} type="button" class="cta">+</button>
			</div>
			<div class="flex-1">
				<button type="submit" class="w-full cta primary">Add to cart</button>
				{#if browser}
					<a href={resolve('/#cart')} class="w-full cta muted">
						<p
							class={clsx(
								'text-center',
								!$items[product.stripeProduct.id]?.quantity && 'invisible'
							)}
						>
							{$items[product.stripeProduct.id]?.quantity} in cart
						</p>
					</a>
				{/if}
			</div>
		</form>
	</article>
{:else}
	<p use:slideIn>Product not found!</p>
{/if}
