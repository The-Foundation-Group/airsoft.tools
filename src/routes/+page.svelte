<script>
	import { calculateEnergy } from '$lib/energyCalculator.ts';
	import { onMount } from 'svelte';

	onMount(() => {
	document
		.querySelector('#energy-calculator-input-select')
		.addEventListener('change', updateSelectedEnergy);
	document.querySelector('#energy-calculator-input').addEventListener('submit', (event) => {
		event.preventDefault();
		calculateEnergyOutput();
	});

	function updateSelectedEnergy() {
		document.getElementById('energy-inputEnergy').placeholder = selectedEnergy();
		document.getElementById('energy-inputEnergy').value = '';
	}

	function selectedEnergy() {
		return document.querySelector('input[name="energy-energyType"]:checked').id;
	}

	function calculateEnergyOutput() {
		const inputEnergy = parseFloat(document.getElementById('energy-inputEnergy').value);
		const bbWeight = parseFloat(document.getElementById('energy-bbWeight').valueAsNumber);
		const comparisonBbWeight = parseFloat(
			document.getElementById('energy-bbWeightCompare').valueAsNumber
		);
		document.getElementById('energy-output').innerHTML = calculateEnergy(
			inputEnergy,
			bbWeight,
			comparisonBbWeight,
			selectedEnergy()
		);
	}
	});
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>
<main>
<div id="calculator-content">
<div id="energy-calculator" class="calculator">
	<form id="energy-calculator-input">
		<div id="energy-calculator-input-select">
			<input type="radio" id="Joules" checked name="energy-energyType"/>
			<label class="radioLeft radioLabel" for="Joules">Joules</label>
			<input type="radio" id="FPS" name="energy-energyType"/>
			<label class="radioLabel" for="FPS">FPS</label>
			<input type="radio" id="MPS" name="energy-energyType"/>
			<label class="radioRight radioLabel" for="MPS">MPS</label>
		</div>
		<label for="energy-inputEnergy"></label>
		<input class="inputTextBox" id="energy-inputEnergy" type="number" step="any" placeholder="Joules"/>
		<p>
			<label for="energy-bbWeight">BB Weight (grams)</label>
			<br/>
			<input class="inputTextBox" id="energy-bbWeight" type="number" step="any" placeholder="0.25"/>
		</p>
		<p>
			<label for="energy-bbWeightCompare">Comparison BB</label>
			<br/>
			<input class="inputTextBox" id="energy-bbWeightCompare" type="number" step="any" placeholder="0.25"/>
		</p>
		<button class="calculatorButton">Calculate</button>
	</form>
	<div id="energy-output"></div>
</div>
</div>
</main>

<style>
    /* Global Calculator CSS */

    ::-webkit-input-placeholder { /* Chrome/Opera/Safari */
        font-size: 1rem;
    }
    ::-moz-placeholder { /* Firefox 19+ */
        font-size: 1rem;
    }
    :-ms-input-placeholder { /* IE 10+ */
        font-size: 1rem;
    }
    :-moz-placeholder { /* Firefox 18- */
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
        padding: .5rem;
        width: 12rem;
        min-width: 10rem;
    }
    .midLength{
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
    input[type=number] {
        -moz-appearance: textfield;
    }
    /* Chrome, Safari, Edge, Opera */
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }

    input[type=radio] {
        display:none;
    }
    .radioLabel:hover {
        transition: background-color 0.5s ease, color 0.5s ease;
        background: gray;
        color: #ffffff;
    }
    input[type=radio]:checked + label {
        transition: background-color 0.5s ease, color 0.5s ease;
        background: #000;
        color: #fff;
        border-color: black;
    }
    .radioLabel {
        display: flex;
        align-items:center;
        justify-content:center;
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
        user-select: none; /* Non-prefixed version, currently
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

    #energy-calculator-input-select{
        width: 100%;
        margin-bottom: .5rem;
        display: inline-flex;
    }

    #energy-calculator-input-select>.radioLabel {
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
    #tof-distance-layout{
        margin-top: .5rem;
        display: flex;
        width: 100%
    }
    #tof-units-selector{
        display: inline-flex;
    }

    /* -- TOF Calculator CSS -- */

    #rps-calculator{

    }
    #rps-spring-layout{
        margin-top: .5rem;
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