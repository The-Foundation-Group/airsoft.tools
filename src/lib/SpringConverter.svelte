<script lang="ts">
	import {
		bbEnergyNormalizedJouleOutput,
		decimalizeString,
		fpsOut,
		mpsOut,
		padZeros,
		validateNumber
	} from '$lib/util-lib';
	import type {SpecsObject} from '$lib/types';

	const springTypes = {
		M: { bbWeight: '0.20' },
		SP: { bbWeight: '0.25' },
		'%': { bbWeight: '0.20' }
	};

	const springs = [
		85, 90, 95, 100, 115, 110, 113, 115, 120, 125, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220,
		230, 240, 250
	];

	const bbObject: SpecsObject = { maxValue: 3, maxLength: 5 };
	let springStrength = 120;
	let selectedSpringType = 'M';
	let bbWeight = {value: '', inValid: false};
	let line1 = '';

	function calculateEnergy(event) {
		event.preventDefault();
		line1 = ''
		let tempSpring: number;
		if (selectedSpringType === '%') {
			tempSpring = 90 * (springStrength / 100);
		} else {
			tempSpring = springStrength;
		}

		if (Number(bbWeight.value) === 0) {
			bbWeight.inValid = true;
		} else {
			bbWeight.inValid = false
			buildOutput(tempSpring, Number(bbWeight.value));
		}
	}
	function buildOutput(inputEnergy, weight) {
		let jouleOutput = bbEnergyNormalizedJouleOutput(
			'MPS',
			inputEnergy,
			Number(springTypes[selectedSpringType].bbWeight)
		);
		line1 = `${fpsOut(jouleOutput, weight)} FPS, ${mpsOut(jouleOutput, weight)} MPS, ${padZeros(
			jouleOutput
		)}j`;
	}

	$: bbWeight.value = decimalizeString(bbWeight.value);
</script>

<div class="card w-80 bg-base-200 shadow-xl m-4 min-h-min" style="min-width: 20rem">
	<div tabindex="0" class="collapse collapse-arrow label font-bold rounded-t-lg bg-base-300 drop-shadow-md flex-col">
		<div class="collapse-title text-xl font-medium">
			Spring Rating
		</div>
		<div class="collapse-content">
			<p>tabindex="0" attribute is necessary to make the div focusable</p>
		</div>
	</div>
<!--	<div class="label font-bold rounded-t-lg bg-base-300 justify-center drop-shadow-md">Spring Rating</div>-->
	<div class="card-body p-6 pt-3">
		<form id="energy-calculator-input">
			<div class="join pb-1" style="display: flex;">
				{#each Object.entries(springTypes) as [springType]}
					<input
						class="join-item btn btn-outline btn-primary no-animation grow basis-0 p-0 justify-center text-lg font-bold !outline-none focus:btn-active"
						type="radio"
						name="energyType"
						id={springType}
						aria-label={springType}
						value={springType}
						bind:group={selectedSpringType}
					/>
				{/each}
				<select bind:value={springStrength} class="select select-bordered w-32 max-w-xs join-item">
					{#each springs as spring}
						<option value={spring}>{spring}</option>
					{/each}
				</select>
			</div>
			<label class="label pt-3 font-bold" for="energy-bbWeight">BB Weight</label>
			<div data-tip="Maximum of {bbObject.maxValue} grams." class="tooltip tooltip-bottom w-full">
				<input
					class="input input-bordered w-full max-w-xs !outline-none transition-colors"
					class:emptyInput={bbWeight.inValid && bbWeight.value === ''}
					id="energy-bbWeight"
					bind:value={bbWeight.value}
					placeholder={`${springTypes[selectedSpringType].bbWeight}`}
					on:beforeinput={(event) => validateNumber(event, bbWeight.value, bbObject)}
					inputmode="decimal"
					autocomplete="off"
				/>
			</div>
			<!--			<span class="input" />-->
			<button class="btn btn-secondary w-full mt-4 text-lg font-bold" on:click={calculateEnergy}
				>Calculate</button
			>
		</form>
		<div class="label min-h-[1.75rem] items-start p-0 justify-center text-lg font-bold select-text">
			{line1}
		</div>
	</div>
</div>

<style>
</style>
