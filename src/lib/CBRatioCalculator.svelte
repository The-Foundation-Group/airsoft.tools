<script lang="ts">
	import {
		calcVolume,
		decimalizeString,
		idealCylToBarrelRatio,
		padZeros,
		roundTo,
		solveFromVolume,
		validateNumber,
		volumeToBarrelRatio
	} from '$lib/util-lib';
	import { aegBarrelList, barrelDiameters, cylTypes, gbbBarrelList } from '$lib/values';
	import { clickoutside } from '@svelte-put/clickoutside';
	import { slide } from 'svelte/transition';
	import type { SpecsObject } from '$lib/types';

	let selectedCylType = 'AEG';

	let cylValue = { value: 'Select...', inValid: false };
	let cylReduction = { value: '0', inValid: false };
	let barrelLength = { value: '', inValid: false };
	let bbWeight = { value: '', inValid: false };
	let cylData = { diameter: 0, strokeLength: 0, cylHead: 0 };
	let barrelDiameter = 6.03;
	let currentRatioString = '';
	let bestRatioString = '';
	let recommendedBarrelString = '';
	let gunType = ['AEG', 'Bolt'];
	const bbObject: SpecsObject = { maxValue: 3, maxLength: 5 };
	const barrelLengthObject: SpecsObject = { maxValue: 700, maxLength: 5 };
	const cylObject: SpecsObject = { maxValue: 20, maxLength: 5 };
	let infoOpen = false;

	function calculateRatio(event) {
		event.preventDefault();
		currentRatioString = '';
		bestRatioString = '';
		recommendedBarrelString = '';

		if (Number(barrelLength.value) === 0) {
			barrelLength.inValid = true;
		}

		if (cylData.strokeLength === 0) {
			cylValue.inValid = true;
		}

		if (Number(barrelLength.value) > 0 && cylData.strokeLength > 0) {
			barrelLength.inValid = false;
			cylValue.inValid = false;
			buildOutput();
		}
	}
	function buildOutput() {
		let cylVolume = calcVolume(
			cylData.diameter,
			cylData.strokeLength - (Number(cylReduction.value) + cylData.cylHead)
		);
		let barrelVolume = calcVolume(barrelDiameter, Number(barrelLength.value));
		let currentRatio = volumeToBarrelRatio(cylVolume, barrelVolume);
		currentRatioString = `Current: ${currentRatio}:1`;
		if (Number(bbWeight.value) > 0) {
			let idealRatio = roundTo(idealCylToBarrelRatio(Number(bbWeight.value)), 3);
			if (currentRatio <= idealRatio + 0.1 && currentRatio >= idealRatio - 0.05) {
				currentRatioString = `Close enough!`;
				bestRatioString = ` Current: ${currentRatio}:1, Ideal: ${idealRatio}:1`;
			} else {
				let trueBarrel = roundTo(solveFromVolume(barrelDiameter, cylVolume / idealRatio), 0);
				bestRatioString = `Ideal: ${idealRatio}:1, ${trueBarrel}mm`;
				let closestBarrel;
				let closestRatio;
				if (selectedCylType === 'AEG') {
					closestBarrel = findNearest(trueBarrel, aegBarrelList);
				} else {
					closestBarrel = findNearest(trueBarrel, gbbBarrelList);
				}

				let closestBarrelVolume = calcVolume(6.03, closestBarrel);
				closestRatio = volumeToBarrelRatio(cylVolume, closestBarrelVolume);
				recommendedBarrelString = `Closest is ${closestBarrel}mm at ${closestRatio}:1`;
			}
		}
	}
	function findNearest(find, data) {
		let result = 0;
		for (let i = 0; i < data.length; ++i) {
			if (Math.abs(find - data[i].barrelLength) <= Math.abs(find - result)) {
				result = data[i].barrelLength;
			} else {
				return result;
			}
		}
	}
	$: cylData = cylTypes[selectedCylType][cylValue.value];
	$: bbWeight.value = decimalizeString(bbWeight.value);
</script>

<div class="card w-80 bg-base-200 shadow-xl m-4 min-h-min" style="min-width: 20rem">
	<div
		role="button"
		tabindex="0"
		class="collapse collapse-mod collapse-arrow bg-base-300 drop-shadow-md"
	>
		<button
			use:clickoutside
			on:clickoutside={() => (infoOpen = false)}
			on:click={() => (infoOpen = !infoOpen)}
			class:shadow-lg={infoOpen}
			class="label text-xl font-bold px-4 py-2 text-gray-900 bg-transparent z-10"
			style="height: 2.5rem"
		>
			<span>Cylinder Ratio</span>
			<svg
				fill="currentColor"
				viewBox="0 0 20 20"
				class:rotate-180={infoOpen}
				class:rotate-0={!infoOpen}
				class="inline w-6 h-6 transition-transform duration-150 transform"
				><path
					fill-rule="evenodd"
					d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
					clip-rule="evenodd"
				/></svg
			>
		</button>
		{#if infoOpen}
			<div class="px-4 pb-2 py-1 bg-gray-300" transition:slide={{ delay: 10, duration: 150 }}>
				<p>
					Max piston stroke and cyl head thickness are taken into account for volume calculations.
				</p>
			</div>
		{/if}
	</div>
	<div class="card-body p-6 pt-3">
		<form id="energy-calculator-input">
			<div class="join pb-1" style="display: flex;">
				{#each gunType as type}
					<input
						class="join-item btn btn-outline btn-primary no-animation grow basis-0 p-0 justify-center text-lg font-bold !outline-none focus:btn-active"
						type="radio"
						name="gunType"
						id={type}
						aria-label={type}
						value={type}
						bind:group={selectedCylType}
						on:click={() => {
							cylValue.value = 'Select...';
							cylValue.inValid = false;
						}}
					/>
				{/each}
				<select
					bind:value={cylValue.value}
					class="select select-primary w-[8.5rem] max-w-xs join-item focus:outline-none focus:outline-[3px] focus:outline-primary focus:outline-offset-[-3px] pl-3 pr-3"
					class:emptyInput={cylValue.inValid && cylValue.value === 'Select...'}
				>
					{#each Object.entries(cylTypes[selectedCylType]) as [name, data]}
						<option disabled={data.strokeLength === 0} value={name}>{`${name}`}</option>
					{/each}
				</select>
			</div>
			<label class="label pt-2 pb-1 font-bold" for="cylReduction">
				<span class="label-text">AOE/Airbrake (mm)</span>
			</label>
			<input
				class="input input-bordered w-full max-w-xs focus:ring-2 focus:ring-inset ring-slate-300 !outline-none transition-colors"
				class:emptyInput={cylReduction.inValid && cylReduction.value === ''}
				id="cylReduction"
				bind:value={cylReduction.value}
				on:beforeinput={(event) => validateNumber(event, cylReduction.value, cylObject)}
				inputmode="decimal"
				autocomplete="off"
			/>
			<label for="barrelLength" class="label pt-2 pb-1 font-bold">
				<span class="label-text">Barrel length</span>
				<span for="barrelDiameter" class="label-text">Barrel Diameter</span>
			</label>
			<div class="join pb-1" style="display: flex;">
				<input
					class="join-item input input-bordered w-0 grow basis-0 focus:ring-2 focus:ring-inset ring-slate-300 !outline-none transition-colors"
					class:emptyInput={barrelLength.inValid && barrelLength.value === ''}
					id="barrelLength"
					bind:value={barrelLength.value}
					placeholder={`363 (mm)`}
					on:beforeinput={(event) => validateNumber(event, barrelLength.value, barrelLengthObject)}
					inputmode="decimal"
					autocomplete="off"
				/>
				<div class="join-item input shrink-0 input-bordered text-lg font-bold pl-1 pr-1 pt-2">
					X
				</div>
				<select
					bind:value={barrelDiameter}
					id="barrelDiameter"
					class="select select-primary w-[6.5rem] max-w-xs join-item focus:outline-none focus:outline-[3px] focus:outline-primary focus:outline-offset-[-3px] pl-3 pr-3"
				>
					{#each barrelDiameters as diameter}
						<option value={diameter}>{`${padZeros(diameter)} mm`}</option>
					{/each}
				</select>
			</div>
			<label class="label pt-2 font-bold pb-1" for="energy-bbWeight">
				<span class="label-text">BB Weight</span>
			</label>
			<input
				class="input input-bordered w-full max-w-xs focus:ring-2 focus:ring-inset ring-slate-300 !outline-none transition-colors"
				class:emptyInput={bbWeight.inValid && bbWeight.value === ''}
				id="energy-bbWeight"
				bind:value={bbWeight.value}
				placeholder={`0.25`}
				on:beforeinput={(event) => validateNumber(event, bbWeight.value, bbObject)}
				inputmode="decimal"
				autocomplete="off"
			/>
			<button
				class="btn btn-warning w-full mt-4 text-lg font-bold"
				on:click={calculateRatio}
				class:validButton={Number(barrelLength.value) > 0 && cylData.strokeLength > 0}
				>Ratio
			</button>
		</form>
		<div
			class="label min-h-[1.75rem] items-start p-0 justify-center text-center text-lg font-bold select-text"
		>
			{currentRatioString}
			<br />
			{bestRatioString}
			<br />
			{recommendedBarrelString}
		</div>
	</div>
</div>

<style>
</style>
