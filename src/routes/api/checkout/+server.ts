import type { RequestHandler } from '@sveltejs/kit';
import Stripe from 'stripe';
import { SECRET_STRIPE_KEY } from '$env/static/private';

const stripe = new Stripe(SECRET_STRIPE_KEY, {
	apiVersion: '2025-12-15.clover'
});

export const POST: RequestHandler = async ({ request, url }) => {
	// parse form data
	const form = await request.formData();

	const items = Array.from(form.entries())
		.map(([priceId, quantity]) => ({
			price: priceId,
			quantity: Number(quantity)
		}))
		.filter((item) => item.quantity > 0);

	if (items.length === 0) {
		return Response.redirect(url.origin, 303);
	}

	const session = await stripe.checkout.sessions.create({
		mode: 'payment',
		line_items: items,
		success_url: `${url.origin}/thanks?order=completed`,
		cancel_url: `${url.origin}/#cart`
	});

	if (!session.url) {
		return new Response('Failed to create checkout session', { status: 500 });
	}

	return Response.redirect(session.url, 303);
};
