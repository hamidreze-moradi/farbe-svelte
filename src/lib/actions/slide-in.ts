import { browser } from '$app/environment';
import { prefersReducedMotion as isReducedMotion } from '$lib/stores/motion';

import gsap from 'gsap';

export function slideIn(node: HTMLElement) {
	if (!browser) return;

	const ctx = gsap.context(() => {
		gsap.set(node, { opacity: 1 });

		if (isReducedMotion) return;

		gsap.from(node.children, {
			y: 50,
			opacity: 0,
			delay: 0.3,
			duration: 1,
			stagger: 0.2,
			ease: 'power2.out',
			scrollTrigger: {
				trigger: node,
				start: 'top bottom-=25%',
				end: 'bottom top'
			}
		});
	});

	return {
		destroy() {
			ctx?.destroy();
		}
	};
}
