<script lang="ts">
	import { SliceZone } from '@prismicio/svelte';
	import type { PageProps } from './$types';

	import { components } from '$lib/slices';
	import { getStripeProducts } from '../stripe-products.remote';

	const { data }: PageProps = $props();
</script>

<SliceZone
	slices={data.page.data.slices}
	{components}
	context={{ stripeProducts: await getStripeProducts() }}
/>
