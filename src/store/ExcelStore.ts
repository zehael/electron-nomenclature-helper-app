import { makeAutoObservable } from 'mobx';
import { Workbook, Worksheet } from 'exceljs';

export default class ExcelStore {
	filePath = '';
	isLoading = true;
	wb: Workbook | null = null;
	ws: Worksheet | null = null;
	worksheetList: Worksheet[] = [];

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
}
