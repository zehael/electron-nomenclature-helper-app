import { Workbook } from 'exceljs';
import { useStore } from '../store';

const fs = window.require('fs');

export default function useExcelFile() {
	const { excelStore } = useStore();

	const readFile = async (filePath: string) => {
		const realPath = fs.realpathSync(filePath);
		const buffer = fs.readFileSync(realPath);
		const workbook = new Workbook();
		await workbook.xlsx.load(buffer);
		excelStore.SET_WORKBOOK(workbook);
		const worksheet = workbook.getWorksheet(1);
		excelStore.SET_WORKSHEET(worksheet);
		excelStore.SET_WORKSHEET_LIST(workbook.worksheets);
	};

	return {
		readFile,
	};
}
