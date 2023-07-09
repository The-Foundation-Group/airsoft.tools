import { convertSpeed, padZeros, roundTo } from './util-lib';

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
		comparisonBbWeight
	);
}

function calculateEnergy(inputEnergy: number, bbWeight: number, comparisonBbWeight: number) {
	let output;
	if (!bbWeight && !inputEnergy) {
		output = `Please fill in both ${selectedEnergy()} and BB weight fields.`;
	} else if (!inputEnergy) {
		output = `Please fill in ${selectedEnergy()} field.`;
	} else if (!bbWeight) {
		output = `Please fill in BB weight field.`;
	} else if (
		typeof bbWeight !== 'number' ||
		isNaN(bbWeight) ||
		typeof inputEnergy !== 'number' ||
		isNaN(inputEnergy)
	) {
		output = 'Fields can only accept numbers as input.';
	} else if (
		(selectedEnergy() === 'Joules' && inputEnergy > 6) ||
		(selectedEnergy() !== 'Joules' && bbEnergyNormalizedJouleOutput(bbWeight) > 6)
	) {
		output = `Dangerous value, exceeds 6J.`;
	} else if (comparisonBbWeight) {
		if (typeof comparisonBbWeight !== 'number' || isNaN(comparisonBbWeight)) {
			output = 'Fields can only accept numbers as input.';
		} else output = bbWeightNoCompare() + bbWeightCompare();
	} else output = bbWeightNoCompare();
	return output;

	function calcSpeed(weight: number) {
		return Math.sqrt(inputEnergy / keMath(weight));
	}

	function mpsOut(weight: number) {
		return roundTo(calcSpeed(weight), 2);
	}

	function fpsOut(weight: number) {
		return roundTo(calcSpeed(weight) * 3.28084, 2);
	}

	function keMath(weight: number) {
		return 0.5 * ((1 / 1000) * weight);
	}

	function bbEnergyNormalizedJouleOutput(weight: number) {
		return roundTo(keMath(weight) * convertSpeed(selectedEnergy(), inputEnergy, 'MPS') ** 2, 2);
	}

	function bbWeightNoCompare() {
		let content;
		if (selectedEnergy() !== 'Joules') {
			content = `${padZeros(bbWeight)}g: ${bbEnergyNormalizedJouleOutput(bbWeight)} joules`;
		} else {
			content = `${padZeros(bbWeight)}g: ${fpsOut(bbWeight)} FPS / ${mpsOut(bbWeight)} MPS`;
		}
		return content;
	}

	function bbWeightCompare() {
		let content;
		if (selectedEnergy() !== 'Joules') {
			content = `<br/>
            ${padZeros(comparisonBbWeight)}g: ${bbEnergyNormalizedJouleOutput(
				comparisonBbWeight
			)} joules`;
		} else {
			content = `<br/>
            ${padZeros(comparisonBbWeight)}g: ${fpsOut(comparisonBbWeight)} FPS / ${mpsOut(
				comparisonBbWeight
			)} MPS`;
		}
		return content;
	}
}
