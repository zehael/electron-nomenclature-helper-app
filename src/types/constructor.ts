export interface IConstructorPrice {
	id: number;
	attributes: {
		name: string;
		level: string;
		masterOption: {
			data: IOption;
		};
		masterOptionValue: string;
		priceList: IConstructorPriceSet[];
	};
}

export interface IOption {
	id: number;
	attributes: {
		name: string;
		slug: string;
		defaultValue?: string | null;
		unit?: {
			data?: IMeasure | null;
		};
	};
}

export interface IMeasure {
	id: number;
	attributes: {
		name: string;
		pluralName: string;
	};
}

export interface IConstructorPriceSet {
	name: string;
	price: number;
	weight: number;
	costOfWork: number | null;
	pricesByOption: IConstructorPriceSetByOptions[];
	dynamicPriceByWeight: IConstructorDynamicPriceOptions;
}

export interface IConstructorPriceSetByOptions {
	option: {
		data: IOption;
	};
	optionValue: string;
	price: number;
	metalCost: number | null;
}

export interface IConstructorDynamicPriceOptions {
	weightParam1: number;
	weightParam2: number;
	weightParam3: number | null;
	formulaCode: ConstructorDynamicPriceFormulaCodes | string;
}

export enum ConstructorDynamicPriceFormulaCodes {
	ROD_LENGTH = 'rodLength',
	UDLINITEL = 'udlinitel',
}
