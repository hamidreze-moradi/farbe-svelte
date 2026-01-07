import { browser } from '$app/environment';
import type { StripeProduct } from '$lib/types/stripe';
import { writable, derived } from 'svelte/store';

type CartItem = {
	product: StripeProduct;
	quantity: number;
	name: string;
};

type CartItems = Record<string, CartItem>;

const LOCAL_STORAGE_KEY = 'farbe-cart';

/* ---------------------------------------
   Initial value (SSR safe)
---------------------------------------- */
function getInitialItems(): CartItems {
	if (!browser) return {};

	const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
	return stored ? JSON.parse(stored) : {};
}

/* ---------------------------------------
   Internal store
---------------------------------------- */
const _items = writable<CartItems>(getInitialItems());

/* ---------------------------------------
   Persist to localStorage
---------------------------------------- */
if (browser) {
	_items.subscribe((value) => {
		localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(value));
	});
}

/* ---------------------------------------
   Derived
---------------------------------------- */
const totalPrice = derived(_items, ($items) =>
	Object.values($items).reduce((sum, item) => sum + item.product.price.amount * item.quantity, 0)
);

const totalItems = derived(_items, ($items) =>
	Object.values($items).reduce((sum, item) => sum + item.quantity, 0)
);

/* ---------------------------------------
   Actions
---------------------------------------- */
function upsertItem(item: CartItem) {
	if (item.quantity <= 0) {
		removeItem(item.product.id);
		return;
	}

	_items.update((cart) => ({
		...cart,
		[item.product.id]: item
	}));
}

function removeItem(id: string) {
	_items.update((cart) => {
		const copy = { ...cart };
		delete copy[id];
		return copy;
	});
}

function clear() {
	_items.set({});
}

/* ---------------------------------------
   Public API
---------------------------------------- */
export const cart = {
	items: { subscribe: _items.subscribe }, // read-only
	totalPrice,
	totalItems,
	upsertItem,
	removeItem,
	clear
};
