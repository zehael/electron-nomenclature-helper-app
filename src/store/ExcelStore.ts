import { makeAutoObservable } from 'mobx';
import { Workbook, Worksheet } from 'exceljs';
import { IColumnOfWeightFormula, IWorkMetalCostSettings } from '../types/excell';

export default class ExcelStore {
	filePath = '';
	isLoading = true;
	wb: Workbook | null = null;
	ws: Worksheet | null = null;
	worksheetList: Worksheet[] = [];
	currentRowNum = 1;
	workMetalCostSettings: IWorkMetalCostSettings[] = [];
	columnOfWeightFormulaCell: IColumnOfWeightFormula = {
		rodLength: 21,
		udlinitel: 29,
	};
	workTime = 2;

	constructor() {
		makeAutoObservable(this);
	}

	SET_FILE_PATH(payload: string) {
		this.filePath = payload;
	}

	SET_LOADING(payload: boolean) {
		this.isLoading = payload;
	}

	SET_WORKBOOK(payload: Workbook) {
		this.wb = payload;
	}

	SET_WORKSHEET(payload: Worksheet) {
		this.ws = payload;
	}

	SET_WORKSHEET_LIST(payload: Worksheet[]) {
		this.worksheetList = payload;
	}

	SET_COST_SETTINGS(payload: IWorkMetalCostSettings[]) {
		this.workMetalCostSettings = payload;
	}

	SET_COLUMN_OF_WEIGHT_FORMULA(payload: IColumnOfWeightFormula) {
		this.columnOfWeightFormulaCell = payload;
	}

	SET_CURRENT_ROW_NUM(payload: number) {
		this.currentRowNum = payload;
	}
}
