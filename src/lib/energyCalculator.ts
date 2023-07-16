import { bbEnergyNormalizedJouleOutput, fpsOut, mpsOut, padZeros } from './util-lib';
import type { EnergyObject } from '$lib/types';

export function calculateEnergy(energyObject: EnergyObject) {
	let output;
	const selectedEnergy: string = energyObject['type'];
	const inputEnergy: number = energyObject['inputEnergy'];
	const bbWeight: number = energyObject['bbWeight'];
	const comparisonBbWeight: number = energyObject['compareWeight'];

	if (!bbWeight && !inputEnergy) {
		output = `Please fill in both ${selectedEnergy} and BB weight fields.`;
	} else if (!inputEnergy) {
		output = `Please fill in ${selectedEnergy} field.`;
	} else if (!bbWeight) {
		output = `Please fill in BB weight field.`;
	} else if (
		(selectedEnergy === 'Joules' && inputEnergy > 6) ||
		(selectedEnergy !== 'Joules' &&
			bbEnergyNormalizedJouleOutput(selectedEnergy, inputEnergy, bbWeight) > 6)
	) {
		output = `Dangerous value, exceeds 6J.`;
	} else if (comparisonBbWeight) {
		output = bbWeightNoCompare() + bbWeightCompare();
	} else output = bbWeightNoCompare();
	return output;

	function bbWeightNoCompare() {
		let content;
		if (selectedEnergy !== 'Joules') {
			content = `${padZeros(bbWeight)}g: ${padZeros(
				bbEnergyNormalizedJouleOutput(selectedEnergy, inputEnergy, bbWeight)
			)} joules`;
		} else {
			content = `${padZeros(bbWeight)}g: ${fpsOut(inputEnergy, bbWeight)} FPS / ${mpsOut(
				inputEnergy,
				bbWeight
			)} MPS`;
		}
		return content;
	}

	function bbWeightCompare() {
		let content;
		if (selectedEnergy !== 'Joules') {
			content = `<br/>
            ${padZeros(comparisonBbWeight)}g: ${padZeros(
				bbEnergyNormalizedJouleOutput(selectedEnergy, inputEnergy, comparisonBbWeight)
			)} joules`;
		} else {
			content = `<br/>
            ${padZeros(comparisonBbWeight)}g: ${fpsOut(
				inputEnergy,
				comparisonBbWeight
			)} FPS / ${mpsOut(inputEnergy, comparisonBbWeight)} MPS`;
		}
		return content;
	}
}
