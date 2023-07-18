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

	let tempEnergyObject = {
		inputEnergy: '',
		bbWeight: '',
		compareWeight: ''
	};

	let valid: boolean;
	let selectedEnergy = 'Joules';
	let inputEnergy: number;
	let bbWeight: number;
	let comparisonBbWeight: number;
	let energyOutput = '';
	let comparisonOutput = '';

	function calculateEnergy(event) {
		event.preventDefault();
		inputEnergy = Number(tempEnergyObject.inputEnergy);
		bbWeight = Number(tempEnergyObject.bbWeight);
		comparisonBbWeight = Number(tempEnergyObject.compareWeight);
		energyOutput = buildOutput(inputEnergy, bbWeight);
		if (comparisonBbWeight) {
			comparisonOutput = buildOutput(inputEnergy, comparisonBbWeight);
		}
	}
	function buildOutput(inputEnergy, weight) {
		let output = bbEnergyNormalizedJouleOutput(selectedEnergy, inputEnergy, weight);
		const danger = `Danger, exceeds 6J.`;
		if (selectedEnergy === 'Joules') {
			return `${padZeros(weight)}g: ${fpsOut(inputEnergy, weight)} FPS, ${mpsOut(
				inputEnergy,
				weight
			)} MPS`;
		} else {
			if (output <= 6) {
				return `${padZeros(weight)}g: ${padZeros(output)} joules`;
			} else return `${padZeros(weight)}g: ${danger}`;
		}
	}

	$: tempEnergyObject.inputEnergy = decimalizeString(tempEnergyObject.inputEnergy);
	$: tempEnergyObject.bbWeight = decimalizeString(tempEnergyObject.bbWeight);
	$: tempEnergyObject.compareWeight = decimalizeString(tempEnergyObject.compareWeight);
	$: valid = Number(tempEnergyObject.inputEnergy) > 0 && Number(tempEnergyObject.bbWeight) > 0;
</script>

<div class="card w-80 bg-base-200 shadow-xl m-4">
	<div class="card-body p-6">
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
						on:change={() => (tempEnergyObject.inputEnergy = '')}
					/>
				{/each}
			</div>
			<input
				class="input input-bordered w-full max-w-xs !outline-none"
				id="energy-inputEnergy"
				bind:value={tempEnergyObject.inputEnergy}
				placeholder={`${selectedEnergy} (Max ${energyTypes[selectedEnergy].maxValue})`}
				on:beforeinput={(event) =>
					validateNumber(event, tempEnergyObject.inputEnergy, energyTypes[selectedEnergy])}
				inputmode="decimal"
				autocomplete="off"
			/>
			<label class="label pt-3 font-bold" for="energy-bbWeight">BB Weight (grams)</label>
			<input
				class="input input-bordered w-full max-w-xs !outline-none"
				id="energy-bbWeight"
				bind:value={tempEnergyObject.bbWeight}
				placeholder={`0.25 (Max ${bbObject['bb'].maxValue})`}
				on:beforeinput={(event) => validateNumber(event, tempEnergyObject.bbWeight, bbObject.bb)}
				inputmode="decimal"
				autocomplete="off"
			/>
			<label class="label pt-3 font-bold" for="energy-bbWeightCompare">Comparison BB Weight</label>
			<input
				class="input input-bordered w-full max-w-xs !outline-none"
				id="energy-bbWeightCompare"
				bind:value={tempEnergyObject.compareWeight}
				placeholder={`0.25 (Max ${bbObject['bb'].maxValue})`}
				on:beforeinput={(event) =>
					validateNumber(event, tempEnergyObject.compareWeight, bbObject.bb)}
				inputmode="decimal"
				autocomplete="off"
			/>
			<!--			<span class="input" />-->
			<button
				class="btn btn-secondary w-full mt-4 text-lg font-bold"
				disabled={!valid}
				on:click={calculateEnergy}>Calculate</button
			>
		</form>
		<div class="label min-h-[1.75rem] items-start p-0 justify-center text-lg font-bold select-text">
			{energyOutput}
			<br />
			{comparisonOutput}
		</div>
	</div>
</div>

<style>
</style>
