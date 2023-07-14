<script lang="ts">
	import {calculateEnergy} from '$lib/energyCalculator.ts';
	import {onMount} from 'svelte';
	import {themeChange} from 'theme-change';
	import {decimalizeString, validateNumber} from '$lib/util-lib';

	let energyTypes = ['Joules', 'FPS', 'MPS'];
	let tempEnergyObject = {
		inputEnergy: '',
		bbWeight: '',
		compareWeight: ''
	};
	let energyObject = {
		type: 'Joules',
		inputEnergy: 0,
		bbWeight: 0,
		compareWeight: 0
	};
	let energyOutput = '';

	onMount(() => {
		themeChange(false);
	});

	function doEnergy() {
		energyObject.inputEnergy = Number(tempEnergyObject.inputEnergy);
		energyObject.bbWeight = Number(tempEnergyObject.bbWeight);
		energyObject.compareWeight = Number(tempEnergyObject.compareWeight);
		energyOutput = calculateEnergy(energyObject);
	}
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>
<main>
	<div class="container mx-auto flex justify-center">
		<div class="card w-96 bg-base-200 shadow-xl m-4">
			<div class="card-body">
				<form id="energy-calculator-input">
					<div class="join pb-1" style="display: flex;">
						{#each energyTypes as energyType}
							<input
								class="join-item btn btn-outline btn-primary no-animation grow basis-0 justify-center"
								type="radio"
								name="energyType"
								id={energyType}
								aria-label={energyType}
								value={energyType}
								bind:group={energyObject.type}
								on:change={() => (tempEnergyObject.inputEnergy = null)}
							/>
						{/each}
					</div>
					<input
						class="input input-bordered w-full max-w-xs"
						id="energy-inputEnergy"
						bind:value={tempEnergyObject.inputEnergy}
						placeholder={energyObject.type}
						on:beforeinput={(event) => validateNumber(event, tempEnergyObject.inputEnergy)}
						on:input={() =>
							(tempEnergyObject.inputEnergy = decimalizeString(tempEnergyObject.inputEnergy))}
						inputmode="numeric"
					/>
					<label class="label pt-3" for="energy-bbWeight">BB Weight (grams)</label>
					<input
						class="input input-bordered w-full max-w-xs"
						id="energy-bbWeight"
						bind:value={tempEnergyObject.bbWeight}
						placeholder="0.25"
						on:beforeinput={(event) => validateNumber(event, tempEnergyObject.bbWeight)}
						on:input={() =>
							(tempEnergyObject.bbWeight = decimalizeString(tempEnergyObject.bbWeight))}
						inputmode="numeric"
					/>
					<label class="label pt-3" for="energy-bbWeightCompare">Comparison BB weight</label>
					<input
						class="input input-bordered w-full max-w-xs"
						id="energy-bbWeightCompare"
						bind:value={tempEnergyObject.compareWeight}
						placeholder="0.25"
						on:beforeinput={(event) => validateNumber(event, tempEnergyObject.compareWeight)}
						on:input={() =>
							(tempEnergyObject.compareWeight = decimalizeString(tempEnergyObject.compareWeight))}
						inputmode="numeric"
					/>
					<button class="btn btn-secondary w-full mt-4" on:click={() => doEnergy()}
						>Calculate</button
					>
				</form>
				<div class="label h-14 items-start" id="energy-output">{@html energyOutput}</div>
			</div>
		</div>
	</div>
</main>

<style>
</style>
