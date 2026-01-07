<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { type Snippet } from 'svelte';
	import { MathUtils, type Group } from 'three';

	interface Props {
		speed?: number;
		rotationFactor?: number;
		floatFactor?: number;
		range?: [number, number];
		children: Snippet;
	}

	let {
		speed = 1,
		rotationFactor = 1,
		floatFactor = 1,
		range = [-0.1, 0.1],
		children
	}: Props = $props();

	let group = $state<Group>();

	const PERIOD_SCALE = 1 / 4;
	const AMPLITUDE_ROTATION_X = 1 / 8;
	const AMPLITUDE_ROTATION_Y = 1 / 8;
	const AMPLITUDE_ROTATION_Z = 1 / 20;
	const START_OFFSET = Math.random() * 10000;

	let elapsed = $state(START_OFFSET);
	useTask((delta) => {
		if (!group) {
			return;
		}

		elapsed += delta * speed;
		const theta = elapsed * PERIOD_SCALE;

		group.rotation.x = Math.cos(theta) * AMPLITUDE_ROTATION_X * rotationFactor;
		group.rotation.y = Math.sin(theta) * AMPLITUDE_ROTATION_Y * rotationFactor;
		group.rotation.z = Math.sin(theta) * AMPLITUDE_ROTATION_Z * rotationFactor;
		group.position.y =
			MathUtils.mapLinear(Math.sin(theta), -1, 1, range[0], range[1]) * floatFactor;
	});
</script>

<T.Group bind:ref={group}>
	{@render children()}
</T.Group>
