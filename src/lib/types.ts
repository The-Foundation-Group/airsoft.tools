export type EnergyObject = {
	type: string;
	inputEnergy: number;
	bbWeight: number;
	compareWeight: number;
};

export type FullSpecsObject = {
	[keys: string]: {
		maxValue: number;
		maxLength: number;
	};
};

export type SpecsObject = {
	maxValue: number;
	maxLength: number;
};
