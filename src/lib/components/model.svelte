<script lang="ts">
	import { GLTF, useDraco, useTexture } from '@threlte/extras';
	import { Group, Mesh, MeshStandardMaterial, SRGBColorSpace, Texture } from 'three';

	interface Props {
		model: string;
		map: string;
		metalnessMap?: string;
	}

	const { model, map, metalnessMap }: Props = $props();

	const dracoLoader = useDraco();

	let textureMap;
	let textureMetalness;

	let mainMaterial = $state<MeshStandardMaterial | null>(null);

	function handleGltfLoad(ref: Group) {
		if (!ref) return;

		ref.traverse((child) => {
			if (child instanceof Mesh) {
				child.castShadow = true;

				if (child.material instanceof MeshStandardMaterial && !mainMaterial) {
					mainMaterial = child.material;
					applyTextures();
				}
			}
		});
	}

	function applyTextures() {
		if (!mainMaterial) return;

		const mapTex = $textureMap;
		const metalnessTex = $textureMetalness;

		if (!mapTex) return;

		[mapTex, metalnessTex! as Texture].forEach((texture) => {
			if (texture) {
				texture.flipY = false;
				texture.colorSpace = SRGBColorSpace;
				texture.anisotropy = 16;
			}
		});

		mainMaterial.map = mapTex;
		if (metalnessTex) {
			mainMaterial.metalnessMap = metalnessTex as Texture;
		}
		mainMaterial.needsUpdate = true;
	}

	$effect(() => {
		textureMap = useTexture(map);
		if (metalnessMap) {
			textureMetalness = useTexture(metalnessMap);
		}

		applyTextures();
	});
</script>

<GLTF url={model} scale={100} {dracoLoader} oncreate={handleGltfLoad} />
