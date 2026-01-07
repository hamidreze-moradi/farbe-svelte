<script lang="ts">
	import Model from './model.svelte';

	const { model }: { model: string } = $props();
</script>

<Model model="/packaging/packaging.gltf" map="/textures/{model}-packaging-min.jpg" />
