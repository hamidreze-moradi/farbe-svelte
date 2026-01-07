import { prerender } from '$app/server';
import { SECRET_STRIPE_KEY } from '$env/static/private';
import type { StripeProduct } from '$lib/types/stripe';
import Stripe from 'stripe';

const stripe = new Stripe(SECRET_STRIPE_KEY!, {
	apiVersion: '2025-12-15.clover'
});

export const getStripeProducts = prerender(async () => {
	const { data: products } = await stripe.products.list({
		active: true,
		expand: ['data.default_price']
	});

	const productMap: Record<string, StripeProduct> = {};

	for (const product of products) {
		if (
			product.default_price &&
			typeof product.default_price === 'object' &&
			product.default_price.unit_amount
		) {
			productMap[product.id] = {
				id: product.id,
				price: {
					id: product.default_price.id,
					amount: product.default_price.unit_amount
				}
			};
		}
	}

	return productMap;
});
