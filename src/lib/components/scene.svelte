<script lang="ts">
	import { browser } from '$app/environment';
	import { cart } from '$lib/stores/cart';
	import { prefersReducedMotion as isReducedMotion } from '$lib/stores/motion';
	import { T, useTask, useThrelte } from '@threlte/core';
	import { Environment, SoftShadows, Suspense } from '@threlte/extras';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import AbsoluteGroup from './absolute-group.svelte';
	import FilmCanister from './film-canister.svelte';
	import FilmPackaging from './film-packaging.svelte';
	import Levioso from './levioso.svelte';

	type Vec3 = [number, number, number];

	let { totalItems } = cart;

	let activeModel = $state('800');
	let canister = $state<THREE.Group>();
	let canisterInternal = $state<THREE.Group>();
	let packaging = $state<THREE.Group>();

	const { renderer, toneMapping, colorSpace, shadows, scene } = useThrelte();

	shadows.set(true);
	colorSpace.set('srgb');
	toneMapping.set(THREE.ACESFilmicToneMapping);
	renderer.toneMappingExposure = 3;
	scene.environmentIntensity = 0.25;

	let width = $state(window.innerWidth);

	const options = $derived.by(() => {
		if (width >= 1280) {
			return {
				x: 0.33,
				canisterPosition: [1.5, 2.5, 0],
				packagingPosition: [-1.5, -2.5, 0],
				scale: 1
			};
		}

		return {
			x: 0.5,
			canisterPosition: [2.5, 4.5, 0],
			packagingPosition: [-2.5, -5, 0],
			scale: 0.75
		};
	});

	$effect(() => {
		const onResize = () => {
			width = window.innerWidth;
		};

		window.addEventListener('resize', onResize);
		return () => window.removeEventListener('resize', onResize);
	});

	// rotating animation for canister
	let elapsed = $state(0);
	useTask((delta) => {
		elapsed += delta;
		if (canisterInternal)
			canisterInternal.rotation.y = Math.PI / 4 - (Math.sin(elapsed * 0.25) * Math.PI) / 2;
	});

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);

		gsap.context(() => {
			if (!browser) {
				return;
			}

			if (!canister || !packaging) {
				return;
			}

			const canisterPosition = canister.position;
			const packagingPosition = packaging.position;

			const canisterRotation = canister.rotation;
			const packagingRotation = packaging.rotation;

			function animateScroll() {
				const sections = document.querySelectorAll<HTMLElement>('[data-scene-position]');

				sections.forEach((section) => {
					const model = section.dataset.sceneModel;
					const position = section.dataset.scenePosition;
					const shouldRotate = !$isReducedMotion && Boolean(section.dataset.sceneRotate);

					function onUpdate(this: gsap.TweenVars) {
						if (this.progress() > 0.2 && this.progress() < 0.7 && model) {
							activeModel = model;
						}
					}

					function onRefresh(self: ScrollTrigger) {
						if (self.isActive && model) {
							activeModel = model;
						}
					}

					if (position === 'center' || position === 'top') {
						gsap.to([canisterPosition, packagingPosition], {
							y: position === 'center' ? 0 : 24,
							stagger: 0.05,
							ease: 'power2.inOut',
							repeatRefresh: true,
							onUpdate: shouldRotate ? undefined : onUpdate,
							scrollTrigger: {
								trigger: section,
								start: position === 'center' ? 'top+=40% bottom' : 'top bottom',
								end: position === 'center' ? 'top+=90% bottom' : 'top+=50% bottom',
								scrub: true,
								invalidateOnRefresh: true,
								onRefresh: shouldRotate ? undefined : onRefresh
							}
						});
					}

					if (shouldRotate) {
						gsap.to([canisterRotation, packagingRotation], {
							y: `+=${Math.PI * 2}`,
							stagger: 0.05,
							ease: 'linear',
							repeatRefresh: true,
							onUpdate,
							scrollTrigger: {
								trigger: section,
								start: 'top center',
								end: 'bottom center',
								scrub: 0.6,
								invalidateOnRefresh: true,
								onRefresh
							}
						});
					}
				});
			}

			// Intro animation
			if (!$isReducedMotion && window.scrollY < 20) {
				gsap.fromTo(
					[canisterPosition, packagingPosition],
					{
						y: -12
					},
					{
						y: 0,
						delay: 0.3,
						duration: 1,
						stagger: 0.2,
						ease: 'power2.out',
						onComplete: animateScroll
					}
				);
			} else {
				animateScroll();
			}

			if (!$isReducedMotion) {
				$effect(() => {
					if ($totalItems)
						gsap.to([canisterRotation, packagingRotation], {
							y: `+=${Math.PI * 2}`,
							stagger: 0.05,
							duration: 0.8,
							ease: 'power2.inOut'
						});
				});
			}
		});
	});
</script>

<T.PerspectiveCamera makeDefault fov={45} position={[0, 0, 20]} look-at={[0, 0, 0]} />

<AbsoluteGroup x={options.x} distance={20}>
	<T.Group position={options.canisterPosition as Vec3} scale={options.scale}>
		<Levioso>
			<T.Group bind:ref={canister}>
				<T.Group bind:ref={canisterInternal} rotation={[0, 0, Math.PI / 8]}>
					<FilmCanister model={activeModel} />
				</T.Group>
			</T.Group>
		</Levioso>
	</T.Group>

	<T.Group position={options.packagingPosition as Vec3} scale={options.scale}>
		<Levioso>
			<T.Group bind:ref={packaging}>
				<T.Group rotation={[-Math.PI / 2, 0, Math.PI / 3]}>
					<FilmPackaging model={activeModel} />
				</T.Group>
			</T.Group>
		</Levioso>
	</T.Group>
</AbsoluteGroup>

<T.Mesh receiveShadow position={[0, 0, -4]}>
	<T.PlaneGeometry args={[400, 400, 10, 10]} />
	<T.MeshStandardMaterial color="#ffffff" roughness={0.5} metalness={0.5} />
</T.Mesh>

<T.DirectionalLight
	castShadow
	position={[-8, 6, 20]}
	intensity={0.5}
	color="#ffffff"
	oncreate={(ref) => {
		const shadow = ref.shadow;

		if (shadow) {
			shadow.mapSize.set(512, 512);

			shadow.camera.left = -16;
			shadow.camera.right = 16;
			shadow.camera.top = 16;
			shadow.camera.bottom = -16;
		}
	}}
/>

<SoftShadows size={40} samples={10} />

<Suspense>
	<Environment url="/textures/lobby.hdr" />
</Suspense>
