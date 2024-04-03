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
	import { slide } from 'svelte/transition';
	import type { SpecsObject } from '$lib/types';
	import CalcHeader from '$lib/calc-assets/CalcHeader.svelte';

	let selectedCylType = 'AEG';

	let cylValue = { value: 'Select...', inValid: false };
	let cylReduction = { value: '0', inValid: false };
	let barrelLength = { value: '', inValid: false };
	let bbWeight = { value: '', inValid: false };
	let cylData = { diameter: 0, strokeLength: 0, cylHead: 0 };
	let barrelDiameter = 6.03;
	let barrelVolume;
	let currentRatio;
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

		if (Number(barrelLength.value) === 0 && Number(bbWeight.value) === 0) {
			barrelLength.inValid = true;
			bbWeight.inValid = true;
		}

		if (cylData.strokeLength === 0) {
			cylValue.inValid = true;
		}

		if (
			(Number(barrelLength.value) > 0 || Number(bbWeight.value) > 0) &&
			cylData.strokeLength > 0
		) {
			barrelLength.inValid = false;
			cylValue.inValid = false;
			bbWeight.inValid = false;
			buildOutput();
		}
	}
	function buildOutput() {
		let cylVolume = calcVolume(
			cylData.diameter,
			cylData.strokeLength - (Number(cylReduction.value) + cylData.cylHead)
		);
		if (Number(barrelLength.value) > 0) {
			barrelVolume = calcVolume(barrelDiameter, Number(barrelLength.value));
			currentRatio = volumeToBarrelRatio(cylVolume, barrelVolume);
			currentRatioString = `Current: ${currentRatio}:1`;
		}

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
		var result = 0;
		for (let i = 0; i < data.length; ++i) {
			if (Math.abs(find - data[i].barrelLength) <= Math.abs(find - result)) {
				result = data[i].barrelLength;
			} else if (result === 0) {
				return data[i].barrelLength;
			} else {
				return result;
			}
		}
		return result;
	}
	$: cylData = cylTypes[selectedCylType][cylValue.value];
	$: bbWeight.value = decimalizeString(bbWeight.value);
</script>

<div class="calcCard">
	<CalcHeader title="Cylinder Ratio" bind:open={infoOpen} />
	{#if infoOpen}
		<div class="calcInfoBox" transition:slide={{ delay: 10, duration: 150 }}>
			<p>
				Max piston stroke and cyl head thickness are taken into account for volume calculations.
			</p>
		</div>
	{/if}
	<div class="calcBody">
		<form id="energy-calculator-input">
			<div class="join pb-1" style="display: flex;">
				{#each gunType as type}
					<input
						class="calcJoinButton btn btn-outline btn-primary"
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
					class="calcBaseDropdownSelector w-[8.5rem]"
					class:emptyInput={cylValue.inValid && cylValue.value === 'Select...'}
				>
					{#each Object.entries(cylTypes[selectedCylType]) as [name, data]}
						<option disabled={data.strokeLength === 0} value={name}>{`${name}`}</option>
					{/each}
				</select>
			</div>
			<label class="calcLabel" for="cylReduction">
				<span class="label-text">AOE/Airbrake (mm)</span>
			</label>
			<input
				class="calcBaseInputTextBox"
				class:emptyInput={cylReduction.inValid && cylReduction.value === ''}
				id="cylReduction"
				bind:value={cylReduction.value}
				on:beforeinput={(event) => validateNumber(event, cylReduction.value, cylObject)}
				inputmode="decimal"
				autocomplete="off"
			/>
			<label for="barrelLength" class="calcLabel">
				<span class="label-text">Barrel length</span>
				<span for="barrelDiameter" class="label-text">Barrel Diameter</span>
			</label>
			<div class="join pb-1" style="display: flex;">
				<input
					class="calcBaseInputTextBox join-item !w-0 grow basis-0"
					class:emptyInput={barrelLength.inValid && barrelLength.value === ''}
					id="barrelLength"
					bind:value={barrelLength.value}
					placeholder={`363 (mm)`}
					on:beforeinput={(event) => validateNumber(event, barrelLength.value, barrelLengthObject)}
					on:input={() => (bbWeight.inValid = false)}
					inputmode="decimal"
					autocomplete="off"
				/>
				<div class="join-item input shrink-0 input-bordered text-lg font-bold pl-1 pr-1 pt-2">
					X
				</div>
				<select
					bind:value={barrelDiameter}
					id="barrelDiameter"
					class="calcBaseDropdownSelector w-[6.5rem]"
				>
					{#each barrelDiameters as diameter}
						<option value={diameter}>{`${padZeros(diameter)} mm`}</option>
					{/each}
				</select>
			</div>
			<label class="calcLabel" for="energy-bbWeight">
				<span class="label-text">BB Weight</span>
			</label>
			<input
				class="calcBaseInputTextBox"
				class:emptyInput={bbWeight.inValid && bbWeight.value === ''}
				id="energy-bbWeight"
				bind:value={bbWeight.value}
				placeholder={`0.25`}
				on:beforeinput={(event) => validateNumber(event, bbWeight.value, bbObject)}
				on:input={() => (barrelLength.inValid = false)}
				inputmode="decimal"
				autocomplete="off"
			/>
			<button
				class="calcButton"
				on:click={calculateRatio}
				class:validButton={(Number(barrelLength.value) > 0 || Number(bbWeight.value) > 0) &&
					cylData.strokeLength > 0}
				>Ratio
			</button>
		</form>
		<div class="calcOutput">
			{currentRatioString}
			<br />
			{bestRatioString}
			<br />
			{recommendedBarrelString}
		</div>
	</div>
</div>

<style type="text/m-css">
	@import './calc.mcss';
</style>
