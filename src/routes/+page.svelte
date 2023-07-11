<script lang="ts">
	import {calculateEnergy} from '$lib/energyCalculator.ts';
	import Card from '@smui/card';
	import LayoutGrid, {Cell} from '@smui/layout-grid';
	import SegmentedButton, {Segment} from '@smui/segmented-button';
	import Button from '@smui/button';
	import {Label} from '@smui/common';
	import Textfield from '@smui/textfield';

	let energyTypes = ['Joules', 'FPS', 'MPS'];
	let energyObject = {
		type:"Joules",
		inputEnergy: null,
		bbWeight: null,
		compareWeight: null
	};
	let tempEnergyObject = {
		type:"Joules",
		inputEnergy: null,
		bbWeight: null,
		compareWeight: null
	};
	let energyOutput = '';
	const validNumber = new RegExp(/^\d*\.?\d*$/);

	// function buildEnergyObjectPayload {
	//
	// }
	function validateNumber(elem, value) {
		// debugger;
			if (elem.inputType === "deleteContentBackward" && tempEnergyObject[value].length > 0) {
				tempEnergyObject[value] = tempEnergyObject[value].slice(0,-1)
				energyObject[value] = tempEnergyObject[value]
			} else if (validNumber.test(elem.data)) {
				energyObject[value] = (tempEnergyObject[value] === null ? elem.data : tempEnergyObject[value]+elem.data);
				tempEnergyObject[value] = energyObject[value]
			} else {
				energyObject[value] = tempEnergyObject[value]
			}
	}
	function doEnergy() {
		energyOutput = calculateEnergy(energyObject);
	}
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>
<main>
	<LayoutGrid>
		<Cell span={6}>
			<Card padded>
					<SegmentedButton
						style="display: flex;"
						segments={energyTypes}
						let:segment
						singleSelect
						selected={energyObject.type}
					>
						<Segment color="secondary" variant="raised" style="flex-grow: 1;" {segment} on:click={() => energyObject.type = segment}>
							<Label>{segment}</Label>
						</Segment>
					</SegmentedButton>
					<Textfield
						style="margin-top: 5px; margin-bottom: 10px"
						variant="outlined"
						bind:value={energyObject.inputEnergy}
                        input$placeholder={energyObject.type}
						required
						on:input={(input) => validateNumber(input, "type")}
					/>
					<Label>BB Weight (grams)</Label>
					<Textfield
						style="margin-top: 5px; margin-bottom: 10px"
						variant="outlined"
						bind:value={energyObject.bbWeight}
						input$placeholder="0.25"
						required
						input$mode="numeric"
						on:input={(input) => validateNumber(input, "bbWeight")}
					/>
					<Label>Comparison BB</Label>
					<Textfield
						style="margin-top: 5px; margin-bottom: 10px; -webkit-appearance: none; -moz-appearance: textfield;"
						variant="outlined"
						bind:value={energyObject.compareWeight}
						input$placeholder="0.25"
						input$mode="numeric"
						on:input={(input) => validateNumber(input, "compareWeight")}
					/>
					<Button color="secondary" variant="raised" on:click={() => doEnergy()}>Calculate</Button>
				<div id="energy-output">{energyOutput}</div>
			</Card>
		</Cell>
	</LayoutGrid>
</main>

<style>
	/* Global Calculator CSS */

	::-webkit-input-placeholder {
		/* Chrome/Opera/Safari */
		font-size: 1rem;
	}

	::-moz-placeholder {
		/* Firefox 19+ */
		font-size: 1rem;
	}

	:-ms-input-placeholder {
		/* IE 10+ */
		font-size: 1rem;
	}

	:-moz-placeholder {
		/* Firefox 18- */
		font-size: 1rem;
	}

	#calculator-content {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
	}

	.calculator {
		background-color: antiquewhite;
		margin: 20px 10px;
		padding: 0.5rem;
		width: 12rem;
		min-width: 10rem;
	}

	.midLength {
		width: 3.25rem;
	}

	.calculatorButton {
		height: 2rem;
		font-size: 1rem;
		width: 6rem;
	}

	.inputTextBox {
		height: 2rem;
		width: 100%;
		font-size: 1rem;
	}

	/* Firefox */
	input[type='number'] {
		-moz-appearance: textfield;
	}

	/* Chrome, Safari, Edge, Opera */
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
	}

	input[type='radio'] {
		display: none;
	}

	.radioLabel:hover {
		transition: background-color 0.5s ease, color 0.5s ease;
		background: gray;
		color: #ffffff;
	}

	input[type='radio']:checked + label {
		transition: background-color 0.5s ease, color 0.5s ease;
		background: #000;
		color: #fff;
		border-color: black;
	}

	.radioLabel {
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background-color 0.5s ease, color 0.5s ease;
		background-color: lightgray;
		border-style: solid;
		border-width: 1px;
		border-color: black;
		color: #000000;
		height: 2rem;
		-webkit-touch-callout: none; /* iOS Safari */
		-webkit-user-select: none; /* Safari */
		-moz-user-select: none; /* Old versions of Firefox */
		-ms-user-select: none; /* Internet Explorer/Edge */
		user-select: none;
		/* Non-prefixed version, currently
           supported by Chrome, Edge, Opera and Firefox */
	}

	.radioLeft {
		border-radius: 10px 0 0 10px;
		border-right: black;
	}

	.radioRight {
		border-radius: 0 10px 10px 0;
		border-left: black;
	}

	#right-radio {
		margin-right: 0.25rem;
	}

	#left-radio {
		margin-left: 0.25rem;
	}

	.shortLength {
		width: 2.5rem;
	}

	.expandInput {
		flex: 1;
	}

	/* -- Energy Calculator CSS -- */

	#energy-calculator {
	}

	#energy-calculator-input-select {
		width: 100%;
		margin-bottom: 0.5rem;
		display: inline-flex;
	}

	#energy-calculator-input-select > .radioLabel {
		flex: 1;
	}

	#energy-output {
		margin-top: 1rem;
		height: 3rem;
		/*background-color: white;*/
	}

	/* -- TOF Calculator CSS -- */

	#tof-calculator {
	}

	#tof-distance-layout {
		margin-top: 0.5rem;
		display: flex;
		width: 100%;
	}

	#tof-units-selector {
		display: inline-flex;
	}

	/* -- TOF Calculator CSS -- */

	#rps-calculator {
	}

	#rps-spring-layout {
		margin-top: 0.5rem;
		display: flex;
		width: 100%;
	}

	#rps-springType-selector {
		display: inline-flex;
	}

	@media (min-width: 576px) {
		.calculator {
			padding: 1rem;
			width: 14rem;
			min-width: 14rem;
		}

		.midLength {
			width: 4rem;
		}
	}
</style>
