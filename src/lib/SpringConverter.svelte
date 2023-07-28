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
	import {clickoutside} from '@svelte-put/clickoutside';
	import {slide} from 'svelte/transition';

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
			<span>Spring to Energy</span>
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
				<p class="font-bold">Data is approximate and is based on manufacturer reported values.</p>
				<p>BB weight max value: 3 (grams)</p>
			</div>
		{/if}
	</div>
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
