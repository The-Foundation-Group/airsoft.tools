<script lang="ts">
	import {
		bbEnergyNormalizedJouleOutput,
		convertSpeed,
		decimalizeString,
		fpsOut,
		mpsOut,
		padZeros,
		validateNumber
	} from '$lib/util-lib';
	import type {FullSpecsObject} from '$lib/types';
	import {roundTo} from '$lib/util-lib.js';

	const energyTypes: FullSpecsObject = {
		Joules: { maxValue: 6, maxLength: 4 },
		FPS: { maxValue: 750, maxLength: 6 },
		MPS: { maxValue: 230, maxLength: 6 }
	};

	const bbObject: FullSpecsObject = { bb: { maxValue: 3, maxLength: 5 } };

	let tempObject = {
		inputEnergy: { value: '', inValid: false },
		bbWeight: { value: '', inValid: false },
		compareWeight: { value: '', inValid: false }
	};

	let selectedEnergy = 'Joules';
	let inputEnergy: number;
	let bbWeight: number;
	let comparisonBbWeight: number;
	let line0 = '';
	let line1 = '';
	let line2 = '';
	function calculateEnergy(event) {
		event.preventDefault();
		line1 = '';
		line2 = '';
		inputEnergy = Number(tempObject.inputEnergy.value);
		bbWeight = Number(tempObject.bbWeight.value);
		comparisonBbWeight = Number(tempObject.compareWeight.value);
		if (inputEnergy === 0) {
			tempObject.inputEnergy.inValid = true;
		}

		if (bbWeight === 0) {
			tempObject.bbWeight.inValid = true;
		}

		if (Number(tempObject.inputEnergy.value) > 0 && Number(tempObject.bbWeight.value) > 0) {
			tempObject.inputEnergy.inValid = false;
			tempObject.bbWeight.inValid = false;

			if (selectedEnergy === 'FPS') {
				line0 = roundTo(convertSpeed(inputEnergy, 'MPS'), 2) + ' MPS';
			}
			if (selectedEnergy === 'MPS') {
				line0 = roundTo(convertSpeed(inputEnergy, 'FPS'), 2) + ' FPS';
			}

			line1 = buildOutput(inputEnergy, bbWeight);

			if (comparisonBbWeight) {
				line2 = buildOutput(inputEnergy, comparisonBbWeight);
			}
		}
	}
	function buildOutput(inputEnergy, weight) {
		const danger = `Danger, exceeds 6J.`;
		if (selectedEnergy === 'Joules') {
			return `${padZeros(weight)}g: ${fpsOut(inputEnergy, weight)} FPS, ${mpsOut(
				inputEnergy,
				weight
			)} MPS`;
		} else {
			let jouleOutput = bbEnergyNormalizedJouleOutput(selectedEnergy, inputEnergy, weight);
			if (jouleOutput <= 6) {
				return `${padZeros(weight)}g: ${padZeros(jouleOutput)} joules`;
			} else return `${padZeros(weight)}g: ${danger}`;
		}
	}

	$: tempObject.inputEnergy.value = decimalizeString(tempObject.inputEnergy.value);
	$: tempObject.bbWeight.value = decimalizeString(tempObject.bbWeight.value);
	$: tempObject.compareWeight.value = decimalizeString(tempObject.compareWeight.value);
</script>

<div class="card w-80 bg-base-200 shadow-xl m-4" style="min-width: 20rem">
	<div tabindex="0" class="collapse collapse-mod collapse-arrow bg-base-300 drop-shadow-md">
		<div class="collapse-title collapse-title-mod label text-xl font-bold" style="height: 2.5rem">
			Energy Converter
		</div>
		<div class="collapse-content">
			<p class="font-bold">Max values are:</p>
			<ul class="list-disc pl-8">
				<li>Joules: 6</li>
				<li>FPS: 750</li>
				<li>MPS: 320</li>
				<li>BB weight: 3 (grams)</li>
			</ul>
		</div>
	</div>
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
						on:change={() => {
							tempObject.inputEnergy.value = '';
							tempObject.inputEnergy.inValid = false;
						}}
					/>
				{/each}
			</div>
			<input
				class="input input-bordered w-full max-w-xs focus:ring-2 focus:ring-inset ring-slate-300 !outline-none"
				class:emptyInput={tempObject.inputEnergy.inValid &&
					Number(tempObject.inputEnergy.value) === 0}
				id="energy-inputEnergy"
				bind:value={tempObject.inputEnergy.value}
				placeholder={selectedEnergy}
				on:beforeinput={(event) =>
					validateNumber(event, tempObject.inputEnergy.value, energyTypes[selectedEnergy])}
				inputmode="decimal"
				autocomplete="off"
			/>
			<label class="label pt-3 font-bold" for="energy-bbWeight">BB Weight</label>
			<input
				class="input input-bordered w-full max-w-xs focus:ring-2 focus:ring-inset ring-slate-300 !outline-none"
				class:emptyInput={tempObject.bbWeight.inValid && Number(tempObject.bbWeight.value) === 0}
				id="energy-bbWeight"
				bind:value={tempObject.bbWeight.value}
				placeholder={`0.25`}
				on:beforeinput={(event) => validateNumber(event, tempObject.bbWeight.value, bbObject.bb)}
				inputmode="decimal"
				autocomplete="off"
			/>
			<label class="label pt-3 font-bold" for="energy-bbWeightCompare">Comparison BB Weight</label>
			<input
				class="input input-bordered w-full max-w-xs focus:ring-2 focus:ring-inset ring-slate-300 !outline-none"
				id="energy-bbWeightCompare"
				bind:value={tempObject.compareWeight.value}
				placeholder={`0.25`}
				on:beforeinput={(event) =>
					validateNumber(event, tempObject.compareWeight.value, bbObject.bb)}
				inputmode="decimal"
				autocomplete="off"
			/>
			<!--			<span class="input" />-->
			<button
				class="btn btn-warning w-full mt-4 text-lg font-bold"
				on:click={calculateEnergy}
				class:validButton={Number(tempObject.inputEnergy.value) > 0 &&
					Number(tempObject.bbWeight.value) > 0}
				>Calculate
			</button>
		</form>
		<div class="label min-h-[1.75rem] items-start p-0 justify-center text-center text-lg font-bold select-text">
			{line0}
			<br />
			{line1}
			<br />
			{line2}
		</div>
	</div>
</div>

<style>
</style>
