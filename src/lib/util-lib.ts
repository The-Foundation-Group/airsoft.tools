const atm = 14.6959; //psia

//Atmospheric pressure at any given elevation and temperature
export function atmAtElevation(altitudeMeters: number, rankineDegrees: number) {
	return roundTo(
		Math.exp((-9.81 * 0.0289644 * altitudeMeters) / (8.31432 * (rankineDegrees / 1.8))) * atm,
		4
	);
}

//Rounds a number to the decimalAmount input, eg 1.7899, decimal 2 would be 1.79
export function roundTo(input: number, decimalAmount: number) {
	const decimals = Number.parseInt(String('1').padEnd(decimalAmount + 1, '0'));
	return Math.round((input + Number.EPSILON) * decimals) / decimals;
}

export function padZeros(num: number) {
	// makes number eg. 0.2 > 0.20
	return String(num).padEnd(4, '0');
}

//Just returns a ratio as a string
export function volumeToBarrelRatio(cV: number, bV: number) {
	return roundTo(cV / bV, 4) + ':' + '1';
}

export function calcBarrelVolume(barrelDiameter: number, barrelLength: number) {
	return Math.PI * (barrelDiameter / 2) ** 2 * barrelLength;
}

function fmod(a: number, b: number) {
	return a % b;
}

//it takes a BB weight and does *math magic* to output what volume ratio you need
export function idealCylToBarrelRatio(bbWeight: number) {
	return (
		5.28813 *
			(-0.0122026 -
				(6.01464 -
					Math.tan(1.46038 / (-0.0757997 * bbWeight)) *
						Math.cos(Math.round(0.0826453 + bbWeight))) *
					fmod(bbWeight, 0.000604915) +
				bbWeight) -
		fmod(bbWeight, 0.021126) / -0.594958 -
		Math.log10(bbWeight - 0.13223)
	);
}

export function convertAltitude(altitudeUnits: string, altitudeInput: number) {
	if (altitudeUnits === 'meters') {
		return altitudeInput;
	} else {
		return altitudeInput / 3.2808;
	}
}

export function convertToRankine(tempUnit: string, degreeInput: number) {
	switch (tempUnit) {
		case 'C':
			return degreeInput * 1.8 + 491.67;
		case 'F':
			return degreeInput + 459.67;
		case 'K':
			return degreeInput * 1.8;
		case 'R':
			return degreeInput;
		default:
			console.log('Rankine conversion failure, defaulting to 75° F');
			return 534.67;
	}
}

export function convertSpeed(unit: string, inputSpeed: number, convertTo = '') {
	if (convertTo === unit) {
		return inputSpeed;
	} else {
		switch (convertTo) {
			case 'FPS':
				return inputSpeed * 3.28084;
			case 'MPS':
				return inputSpeed * 0.3048;
			default:
				console.log('Speed conversion failure.');
				return inputSpeed;
		}
	}
}
