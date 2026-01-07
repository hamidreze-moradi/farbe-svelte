<script lang="ts">
	import { browser } from '$app/environment';
	import { slideIn } from '$lib/actions/slide-in';
	import { cart } from '$lib/stores/cart';
	import { formatPrice } from '$lib/utils/format-price';
	import { getSceneAttributes } from '$lib/utils/get-scene-attributes';
	import { isFilled, type Content } from '@prismicio/client';
	import { PrismicRichText, type SliceComponentProps } from '@prismicio/svelte';

	type Props = SliceComponentProps<Content.CartSlice>;

	const { slice }: Props = $props();

	const { items, removeItem, totalPrice } = cart;
</script>

<form
	use:slideIn
	{...getSceneAttributes({
		position: 'center',
		model: isFilled.contentRelationship(slice.primary.product)
			? slice.primary.product.uid
			: undefined
	})}
	method="POST"
	action="/api/checkout"
	id="cart"
	class="flex flex-col min-h-screen bounded rich-text"
>
	<PrismicRichText field={slice.primary.title} />
	{#if browser}
		{#if Object.keys($items).length}
			<PrismicRichText field={slice.primary.text} />
			<ul class="mt-16 max-w-[40ch]">
				{#each Object.values($items) as item (item.product.id)}
					<li class="flex items-center">
						<span class="flex-1">{item.name}</span>
						<span aria-label="Quantity of {item.name}" class="flex-1 text-right"
							>{item.quantity}</span
						>
						<span aria-label="Price for {item.quantity} {item.name}" class="flex-1 text-right"
							>{formatPrice(item.product.price.amount * item.quantity)}</span
						>
						<button
							type="button"
							title="Remove from cart"
							onclick={() => removeItem(item.product.id)}
							class="-mr-4 w-12.5 cta">&times;</button
						>
						<input type="hidden" name={item.product.price.id} value={item.quantity} />
					</li>
				{/each}
			</ul>
			<hr class="max-w-[40ch]" />
			<p aria-label="Total price" class="pr-8.5 text-right">{formatPrice($totalPrice)}</p>
			<button type="submit" class="mt-16 w-full max-w-[40ch] cta primary">Checkout</button>
		{:else}
			<PrismicRichText field={slice.primary.empty_text} />
		{/if}
	{/if}
</form>
