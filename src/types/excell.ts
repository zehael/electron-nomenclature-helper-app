export interface IWorkMetalCostPosition {
	name: string;
	rodLength: IMetalWorkCostData;
	udlinitel: IMetalWorkCostData;
}

interface IMetalWorkCostData {
	metalCost: {
		material: {
			u: ICellPosition;
			hl: ICellPosition;
			nz: ICellPosition;
		};
	};
	workCost: ICellPosition;
}

interface ICellPosition {
	row: number;
	cell: number;
}

export interface IWorkMetalCostSettings {
	name: string;
	displayName: string;
	metalCost: {
		material: {
			u: number;
			hl: number;
			nz: number;
		};
	};
	workCost: number;
}

export interface IColumnOfWeightFormula {
	rodLength: number;
	udlinitel: number;
}
