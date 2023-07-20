<script lang="ts">
	import {
		bbEnergyNormalizedJouleOutput,
		decimalizeString,
		fpsOut,
		mpsOut,
		padZeros,
		validateNumber
	} from '$lib/util-lib';
	import type {FullSpecsObject} from '$lib/types';

	const energyTypes: FullSpecsObject = {
		Joules: { maxValue: 6, maxLength: 4 },
		FPS: { maxValue: 750, maxLength: 6 },
		MPS: { maxValue: 230, maxLength: 6 }
	};

	const bbObject: FullSpecsObject = { bb: { maxValue: 3, maxLength: 5 } };

	let tempObject = {
		inputEnergy: {value: '', inValid: false},
		bbWeight: {value: '', inValid: false},
		compareWeight: {value: '', inValid: false}
	};

	let valid: boolean;
	let selectedEnergy = 'Joules';
	let inputEnergy: number;
	let bbWeight: number;
	let comparisonBbWeight: number;
	let output = '';
	let comparisonOutput = '';

	function calculateEnergy(event) {
		event.preventDefault();
		inputEnergy = Number(tempObject.inputEnergy.value);
		bbWeight = Number(tempObject.bbWeight.value);
		comparisonBbWeight = Number(tempObject.compareWeight.value);
		output = buildOutput(inputEnergy, bbWeight);
		if (comparisonBbWeight) {
			comparisonOutput = buildOutput(inputEnergy, comparisonBbWeight);
		}
	}
	function buildOutput(inputEnergy, weight) {
		let jouleOutput = bbEnergyNormalizedJouleOutput(selectedEnergy, inputEnergy, weight);
		const danger = `Danger, exceeds 6J.`;
		if (selectedEnergy === 'Joules') {
			return `${padZeros(weight)}g: ${fpsOut(inputEnergy, weight)} FPS, ${mpsOut(
				inputEnergy,
				weight
			)} MPS`;
		} else {
			if (jouleOutput <= 6) {
				return `${padZeros(weight)}g: ${padZeros(jouleOutput)} joules`;
			} else return `${padZeros(weight)}g: ${danger}`;
		}
	}

	$: tempObject.inputEnergy.value = decimalizeString(tempObject.inputEnergy.value);
	$: tempObject.bbWeight.value = decimalizeString(tempObject.bbWeight.value);
	$: tempObject.compareWeight.value = decimalizeString(tempObject.compareWeight.value);
	$: valid = tempObject.inputEnergy.inValid === false && tempObject.bbWeight.inValid === false;
</script>

<div class="card w-80 bg-base-200 shadow-xl m-4" style="min-width: 20rem">
	<div class="label font-bold rounded-t-lg bg-base-300 justify-center drop-shadow-md">Energy Calculator</div>
	<div class="card-body p-6 pt-3">
		<form id="energy-calculator-input">
			<div class="join pb-1" style="display: flex;">
				{#each Object.entries(energyTypes) as [energyType]}
					<input
						class="join-item btn btn-outline btn-primary no-animation grow basis-0 p-0 justify-center text-lg font-bold !outline-none focus:btn-active"
						type="radio"
						name="energyType"
						id={energyType}
						aria-label={energyType}
						value={energyType}
						bind:group={selectedEnergy}
						on:change={() => (tempObject.inputEnergy.value = '')}
					/>
				{/each}
			</div>
			<input
				class="input input-bordered w-full max-w-xs !outline-none"
				id="energy-inputEnergy"
				bind:value={tempObject.inputEnergy.value}
				placeholder={`${selectedEnergy} (Max ${energyTypes[selectedEnergy].maxValue})`}
				on:beforeinput={(event) =>
					validateNumber(event, tempObject.inputEnergy.value, energyTypes[selectedEnergy])}
				inputmode="decimal"
				autocomplete="off"
			/>
			<label class="label pt-3 font-bold" for="energy-bbWeight">BB Weight (grams)</label>
			<input
				class="input input-bordered w-full max-w-xs !outline-none"
				id="energy-bbWeight"
				bind:value={tempObject.bbWeight.value}
				placeholder={`0.25 (Max ${bbObject['bb'].maxValue})`}
				on:beforeinput={(event) => validateNumber(event, tempObject.bbWeight.value, bbObject.bb)}
				inputmode="decimal"
				autocomplete="off"
			/>
			<label class="label pt-3 font-bold" for="energy-bbWeightCompare">Comparison BB Weight</label>
			<input
				class="input input-bordered w-full max-w-xs !outline-none"
				id="energy-bbWeightCompare"
				bind:value={tempObject.compareWeight.value}
				placeholder={`0.25 (Max ${bbObject['bb'].maxValue})`}
				on:beforeinput={(event) =>
					validateNumber(event, tempObject.compareWeight.value, bbObject.bb)}
				inputmode="decimal"
				autocomplete="off"
			/>
			<!--			<span class="input" />-->
			<button
				class="btn btn-secondary w-full mt-4 text-lg font-bold"
				on:click={calculateEnergy}>Calculate</button
			>
		</form>
		<div class="label min-h-[1.75rem] items-start p-0 justify-center text-lg font-bold select-text">
			{output}
			<br />
			{comparisonOutput}
		</div>
	</div>
</div>

<style>
</style>
