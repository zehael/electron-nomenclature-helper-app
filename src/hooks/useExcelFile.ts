import { Workbook, Worksheet } from 'exceljs';
import { useStore } from '../store';
import { IWorkMetalCostPosition, IWorkMetalCostSettings } from '../types/excell';
import { message } from 'antd';

const fs = window.require('fs');

const costDataCellsPositions: IWorkMetalCostPosition[] = [
	{
		name: 'krp',
		rodLength: {
			metalCost: {
				material: {
					u: {
						row: 4,
						cell: 18,
					},
					hl: {
						row: 4,
						cell: 23,
					},
					nz: {
						row: 4,
						cell: 24,
					},
				},
			},
			workCost: {
				row: 4,
				cell: 20,
			},
		},
		udlinitel: {
			metalCost: {
				material: {
					u: {
						row: 4,
						cell: 26,
					},
					hl: {
						row: 4,
						cell: 31,
					},
					nz: {
						row: 4,
						cell: 32,
					},
				},
			},
			workCost: {
				row: 4,
				cell: 28,
			},
		},
	},
	{
		name: 'kep',
		rodLength: {
			metalCost: {
				material: {
					u: {
						row: 4,
						cell: 19,
					},
					hl: {
						row: 4,
						cell: 24,
					},
					nz: {
						row: 4,
						cell: 25,
					},
				},
			},
			workCost: {
				row: 4,
				cell: 21,
			},
		},
		udlinitel: {
			metalCost: {
				material: {
					u: {
						row: 4,
						cell: 27,
					},
					hl: {
						row: 4,
						cell: 32,
					},
					nz: {
						row: 4,
						cell: 33,
					},
				},
			},
			workCost: {
				row: 4,
				cell: 29,
			},
		},
	},
];

export default function useExcelFile() {
	const { excelStore, constructorStore } = useStore();

	const readFile = async (filePath: string) => {
		const realPath = fs.realpathSync(filePath);
		const buffer = fs.readFileSync(realPath);
		const workbook = new Workbook();
		await workbook.xlsx.load(buffer);
		excelStore.SET_WORKBOOK(workbook);
		const worksheet = workbook.getWorksheet(1);
		excelStore.SET_WORKSHEET(worksheet);
		excelStore.SET_WORKSHEET_LIST(workbook.worksheets);
		defineWorkCostAndMetalCost(worksheet);
	};

	const defineWorkCostAndMetalCost = (worksheet: Worksheet) => {
		excelStore.SET_COST_SETTINGS([]);
		let costSettingsPosition;
		switch (worksheet.name) {
			case '??????':
				costSettingsPosition = costDataCellsPositions.find(item => item.name === 'krp');
				excelStore.SET_COLUMN_OF_WEIGHT_FORMULA({ rodLength: 21, udlinitel: 29 });
				break;
			case '??????':
				costSettingsPosition = costDataCellsPositions.find(item => item.name === 'kep');
				excelStore.SET_COLUMN_OF_WEIGHT_FORMULA({ rodLength: 22, udlinitel: 30 });
				break;
			default:
				break;
		}

		if (!costSettingsPosition) {
			throw new Error('???? ?????????????? ?????????????????? ?????????????? ?????? ?????????????????????? ?????? ???????????? ?? ?????????????????? ??????????????');
		}

		const rodSettings = createWorkMetalCostSettings(worksheet, costSettingsPosition, 'rodLength', '????????????');
		const udlinitelSettings = createWorkMetalCostSettings(worksheet, costSettingsPosition, 'udlinitel', '????????????????????');
		excelStore.SET_COST_SETTINGS([{ ...rodSettings }, { ...udlinitelSettings }]);
	};

	const createWorkMetalCostSettings = (
		ws: Worksheet,
		positionData: IWorkMetalCostPosition,
		name: string,
		displayName: string
	) => {
		let material: any = null;
		let workCost: any = null;
		if (name === 'rodLength') {
			material = positionData.rodLength.metalCost.material;
			workCost = positionData.rodLength.workCost;
		}
		if (name === 'udlinitel') {
			material = positionData.udlinitel.metalCost.material;
			workCost = positionData.udlinitel.workCost;
		}

		if (!material || !workCost) {
			throw new Error('???? ???????????????????? ???????????????????? ????????????????');
		}

		const costSettings: IWorkMetalCostSettings = {
			name,
			displayName,
			metalCost: {
				material: {
					u: Number(getValueFromCellByCoordinates(ws, material.u.row, material.u.cell)),
					hl: Number(getValueFromCellByCoordinates(ws, material.hl.row, material.hl.cell)),
					nz: Number(getValueFromCellByCoordinates(ws, material.nz.row, material.nz.cell)),
				},
			},
			workCost: Number(getValueFromCellByCoordinates(ws, workCost.row, workCost.cell)),
		};

		return costSettings;
	};

	const getValueFromCellByCoordinates = (worksheet: Worksheet, rowNumber: number, cellNumber: number): string => {
		const row = worksheet.getRow(rowNumber);
		return String(row.getCell(cellNumber).value);
	};

	const handleProductRow = async (worksheet: Worksheet, rowNumber: number) => {
		const row = worksheet.getRow(rowNumber);
		const productName = String(row.getCell(2).value).trim();
		const latchDiameter = parseInt(String(row.getCell(1).value).replace(/\S+/, ''));
		if (!productName || (!latchDiameter && latchDiameter !== 0)) {
			message.error('???????????????????? ???? ?????????? ?? ???????????? ????????????');
			return;
		}
		await constructorStore.fetchProductPrice(latchDiameter, productName, rowNumber);
	};

	return {
		readFile,
		defineWorkCostAndMetalCost,
		handleProductRow,
	};
}
