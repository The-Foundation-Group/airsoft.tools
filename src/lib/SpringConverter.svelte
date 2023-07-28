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
	import {springList} from '$lib/values';
	import {slide} from 'svelte/transition';
	import CalcHeader from "$lib/CalcHeader.svelte";

	const springTypes = {
		M: { bbWeight: '0.20' },
		SP: { bbWeight: '0.25' },
		'%': { bbWeight: '0.20' }
	};

	const bbObject: SpecsObject = { maxValue: 3, maxLength: 5 };
	let springStrength = 120;
	let selectedSpringType = 'M';
	let bbWeight = { value: '', inValid: false };
	let conversion = '';
	let infoOpen = false;

	function calculateEnergy(event) {
		event.preventDefault();
		conversion = '';
		let tempSpring: number;
		if (selectedSpringType === '%') {
			tempSpring = mpsOut((springStrength / 100) * 0.81, 0.2);
		} else {
			tempSpring = springStrength;
		}

		if (Number(bbWeight.value) === 0) {
			bbWeight.inValid = true;
		}
		if (Number(bbWeight.value) > 0) {
			bbWeight.inValid = false;
			buildOutput(tempSpring, Number(bbWeight.value));
		}

	}
	function buildOutput(springRating, weight) {
		let jouleOutput = bbEnergyNormalizedJouleOutput('MPS', springRating, Number(springTypes[selectedSpringType].bbWeight));
		conversion = `${fpsOut(jouleOutput, weight)} FPS, ${mpsOut(jouleOutput, weight)} MPS, ${padZeros(
			jouleOutput
		)}j`;
	}

	$: bbWeight.value = decimalizeString(bbWeight.value);
</script>

<div class="card w-80 bg-base-200 shadow-xl m-4 min-h-min" style="min-width: 20rem">
	<CalcHeader title="Spring to Energy" bind:open={infoOpen}></CalcHeader>
		{#if infoOpen}
			<div class="px-4 pb-2 py-1 bg-gray-300" transition:slide={{ delay: 10, duration: 150 }}>
				<p class="font-bold">Data is approximate and is based on manufacturer reported values.</p>
				<p>BB weight max value: 3 (grams)</p>
			</div>
		{/if}
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
				<select
					bind:value={springStrength}
					class="select select-primary w-32 max-w-xs join-item focus:outline-none focus:outline-[3px] focus:outline-primary focus:outline-offset-[-3px] pl-3 pr-3"
				>
					{#each springList as spring}
						<option value={spring}>{spring}</option>
					{/each}
				</select>
			</div>
			<label class="label pt-2 pb-1 font-bold" for="energy-bbWeight">
				<span class="label-text">BB Weight</span>
			</label>
			<input
				class="input input-bordered w-full max-w-xs focus:ring-2 focus:ring-inset ring-slate-300 !outline-none transition-colors"
				class:emptyInput={bbWeight.inValid && bbWeight.value === ''}
				id="energy-bbWeight"
				bind:value={bbWeight.value}
				placeholder={`${springTypes[selectedSpringType].bbWeight}`}
				on:beforeinput={(event) => validateNumber(event, bbWeight.value, bbObject)}
				inputmode="decimal"
				autocomplete="off"
			/>
			<!--			<span class="input" />-->
			<button
				class="btn btn-warning w-full mt-4 text-lg font-bold"
				on:click={calculateEnergy}
				class:validButton={Number(bbWeight.value) > 0}
				>Velocity
			</button>
		</form>
		<div class="label min-h-[1.75rem] items-start p-0 justify-center text-lg font-bold select-text">
			{conversion}
		</div>
	</div>
</div>

<style>
</style>
