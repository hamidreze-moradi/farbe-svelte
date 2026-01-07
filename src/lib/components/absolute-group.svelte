<script lang="ts">
	import { T, useThrelte } from '@threlte/core';
	import type { Snippet } from 'svelte';
	import { PerspectiveCamera } from 'three';

	interface Props {
		x?: number;
		y?: number;
		distance: number;
		children: Snippet;
	}

	type Vec3 = [number, number, number];

	const { distance, x: propX, y: propY, children }: Props = $props();

	const { camera } = useThrelte();

	const position = $derived.by(() => {
		const perspectiveCam = camera.current as PerspectiveCamera;

		const fov = perspectiveCam instanceof PerspectiveCamera ? perspectiveCam.fov : 50;

		const height = 2 * Math.tan((fov * Math.PI) / 180 / 2) * distance;
		const width = height * perspectiveCam.aspect;

		const x = propX ?? 0.5;
		const y = propY ?? 0.5;

		return [width * x - width / 2, height * y - height / 2, 0];
	});
</script>

<T.Group position={position as Vec3}>
	{@render children()}
</T.Group>
