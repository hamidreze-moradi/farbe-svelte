import { readable } from 'svelte/store';

export const prefersReducedMotion = readable(false, (set) => {
	if (typeof window === 'undefined') return;

	const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

	set(mediaQuery.matches);

	const listener = (event: MediaQueryListEvent) => set(event.matches);
	mediaQuery.addEventListener('change', listener);

	return () => mediaQuery.removeEventListener('change', listener);
});
