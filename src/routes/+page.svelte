<script lang="ts">
	import {onMount} from 'svelte';
	import {themeChange} from 'theme-change';
	import EnergyCalculator from "$lib/EnergyCalculator.svelte";
	import SpringConverter from "$lib/SpringConverter.svelte";
	import CBRatioCalculator from "$lib/CBRatioCalculator.svelte";

	onMount(() => {
		themeChange(false);
	});

</script>

<svelte:head>
	<title>Home</title>
</svelte:head>
<main>
	<div class="container mx-auto flex justify-center flex-wrap items-start">
		<EnergyCalculator />
		<SpringConverter />
		<CBRatioCalculator />
	</div>
</main>

<style>
</style>
