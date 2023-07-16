<script lang="ts">
	import {onMount} from 'svelte';
	import {themeChange} from 'theme-change';
	import EnergyCalculator from "$lib/EnergyCalculator.svelte";

	onMount(() => {
		themeChange(false);
	});

</script>

<svelte:head>
	<title>Home</title>
</svelte:head>
<main>
	<div class="container mx-auto flex justify-center">
		<EnergyCalculator />
	</div>
</main>

<style>
</style>
