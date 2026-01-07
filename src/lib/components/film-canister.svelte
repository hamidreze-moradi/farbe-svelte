<script lang="ts">
	import Model from './model.svelte';

	const { model }: { model: string } = $props();
</script>

<Model
	model="/canister/canister.gltf"
	map="/textures/{model}-color-min.jpg"
	metalnessMap="/textures/{model}-metallic-min.jpg"
/>
