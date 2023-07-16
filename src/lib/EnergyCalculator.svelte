<script lang="ts">
    import {
        bbEnergyNormalizedJouleOutput,
        decimalizeString,
        fpsOut,
        mpsOut,
        padZeros,
        validateNumber
    } from '$lib/util-lib';

    let energyTypes = ['Joules', 'FPS', 'MPS'];

	let inputs = [];

	let tempEnergyObject = {
		inputEnergy: '',
		bbWeight: '',
		compareWeight: ''
	};

    let inputsValidity = {
        energy: true,
        weight: true,
        compare: true
    }

	let valid: boolean;
    let energyValid: boolean;
    energyValid = true
    let weightValid: boolean;
    weightValid = true

	let selectedEnergy = 'Joules';
	let inputEnergy: number;
	let bbWeight: number;
	let comparisonBbWeight: number;
	let energyOutput = '';
	let comparisonOutput = '';

	function calculateEnergy(event) {
		event.preventDefault();
		energyOutput = '';
		comparisonOutput = '';
		inputEnergy = Number(tempEnergyObject.inputEnergy);
		bbWeight = Number(tempEnergyObject.bbWeight);
		comparisonBbWeight = Number(tempEnergyObject.compareWeight);
		if (
			(selectedEnergy === 'Joules' && inputEnergy > 6) ||
			(selectedEnergy !== 'Joules' &&
				bbEnergyNormalizedJouleOutput(selectedEnergy, inputEnergy, bbWeight) > 6)
		) {
			energyOutput = `Dangerous value, exceeds 6J.`;
		} else if (comparisonBbWeight) {
			energyOutput = calcOutput(bbWeight);
			comparisonOutput = calcOutput(comparisonBbWeight);
		} else energyOutput = calcOutput(bbWeight);
	}
	function calcOutput(weight) {
		if (selectedEnergy !== 'Joules') {
			return `${padZeros(weight)}g: ${padZeros(
				bbEnergyNormalizedJouleOutput(selectedEnergy, inputEnergy, weight)
			)} joules`;
		} else {
			return `${padZeros(weight)}g: ${fpsOut(inputEnergy, weight)} FPS, ${mpsOut(
				inputEnergy,
				weight
			)} MPS`;
		}
	}

	$: tempEnergyObject.inputEnergy = decimalizeString(tempEnergyObject.inputEnergy);
	$: tempEnergyObject.bbWeight = decimalizeString(tempEnergyObject.bbWeight);
	$: tempEnergyObject.compareWeight = decimalizeString(tempEnergyObject.compareWeight);

    $: valid = Number(tempEnergyObject.inputEnergy) > 0 && Number(tempEnergyObject.bbWeight) > 0;
    $: if (!energyValid) {
        setTimeout(() => {energyValid = true}, 200)
    }
    $: if (!weightValid) {
        setTimeout(() => {weightValid = true}, 200)
    }
</script>

<div class="card w-80 bg-base-200 shadow-xl m-4">
	<div class="card-body p-6">
		<form id="energy-calculator-input">
			<div class="join pb-1" style="display: flex;">
				{#each energyTypes as energyType}
					<input
						class="join-item btn btn-outline btn-primary no-animation grow basis-0 p-0 justify-center text-lg font-bold !outline-none"
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
				class="input input-bordered w-full max-w-xs !outline-none {energyValid? '' : 'border-red-500 transition-[border-color]'}"
				id="energy-inputEnergy"
				bind:value={tempEnergyObject.inputEnergy}
				placeholder={selectedEnergy}
				on:beforeinput={(event) => energyValid = validateNumber(event, tempEnergyObject.inputEnergy)}
				inputmode="decimal"
				autocomplete="off"
			/>
			<label class="label pt-3 font-bold" for="energy-bbWeight">BB Weight (grams)</label>
			<input
				class="input input-bordered w-full max-w-xs !outline-none {weightValid? '' : 'border-red-500 transition-[border-color]'}"
				id="energy-bbWeight"
				bind:value={tempEnergyObject.bbWeight}
				placeholder="0.25"
				on:beforeinput={(event) => weightValid = validateNumber(event, tempEnergyObject.bbWeight)}
				inputmode="decimal"
				autocomplete="off"
			/>
			<label class="label pt-3 font-bold" for="energy-bbWeightCompare">Comparison BB Weight</label>
			<input
				class="input input-bordered w-full max-w-xs !outline-none"
				id="energy-bbWeightCompare"
				bind:value={tempEnergyObject.compareWeight}
				placeholder="0.25"
				on:beforeinput={(event) => validateNumber(event, tempEnergyObject.compareWeight)}
				inputmode="decimal"
				autocomplete="off"
			/>
			<!--			<span class="input" />-->
			<button
				class="btn btn-secondary w-full mt-4 text-lg font-bold {valid
					? ''
					: 'btn-disabled'}"
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
    .error {
        @apply border-red-500;
        @apply transition-[border-color];
    }
</style>
