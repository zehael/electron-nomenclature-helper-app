import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../store';
import { Button, Card, Tag } from 'antd';
import styles from './ConstructorPrice.module.scss';
import { IConstructorPriceSetByOptions } from '../../types/constructor';
import { IWorkMetalCostSettings } from '../../types/excell';

const ConstructorPriceCard = () => {
	const { constructorStore, excelStore } = useStore();

	if (!constructorStore.constructorPrice) {
		return null;
	}

	const handleConstructorPrice = () => {
		console.log('data for update', constructorStore.constructorPrice.attributes);
		const updatedData = JSON.parse(JSON.stringify(constructorStore.constructorPrice.attributes));
		excelStore.workMetalCostSettings.forEach(item => {
			// eslint-disable-next-line no-debugger
			debugger;
			const priceListIdx = updatedData.priceList.findIndex(
				(priceItem: any) => priceItem.name.toLowerCase() === item.displayName.toLowerCase()
			);
			if (priceListIdx >= 0) {
				const formulaOfWeight = getWeightFormula(item.name);
				const formulaWeightItems = formulaOfWeight.replace(/S+|\(|\)/gm, '').split(/\+|\*/gm);
				updatedData.priceList[priceListIdx].costOfWork = item.workCost * excelStore.workTime;
				updatedData.priceList[priceListIdx].dynamicPriceByWeight = createDynamicPricesByWeight(
					formulaWeightItems,
					item.name
				);
				const pricesByOption = updatedData.priceList[priceListIdx].pricesByOption;
				updatedData.priceList[priceListIdx].pricesByOption = handleMetalCostInPriceByOptions(pricesByOption, item);
			} else {
				throw Error('Не найден price set для обработки цены');
			}
		});
		console.log('updated data after handling', updatedData);
	};

	const getWeightFormula = (partName: string): string => {
		const row = excelStore.ws.getRow(excelStore.currentRowNum);
		const weightFormulaColumn = JSON.parse(JSON.stringify(excelStore.columnOfWeightFormulaCell));
		const columnNumByPartName = weightFormulaColumn[partName];
		if (columnNumByPartName) {
			return row.getCell(columnNumByPartName).formula;
		} else {
			throw new Error('Не удалось определить формулу для веса' + partName);
		}
	};

	const createDynamicPricesByWeight = (formulaWeightItems: string[], costSettingName: string) => {
		let result = {
			formulaCode: costSettingName,
		};

		let weightParamIndex = 0;
		formulaWeightItems.forEach(item => {
			if (!isNaN(parseFloat(item))) {
				weightParamIndex += 1;
				const key = `weightParam${weightParamIndex}`;
				const newObj = {
					[key]: parseFloat(item),
				};
				result = { ...result, ...newObj };
			}
		});

		return result;
	};

	const handleMetalCostInPriceByOptions = (
		pricesByOption: IConstructorPriceSetByOptions[],
		costSettingsItem: IWorkMetalCostSettings
	): IConstructorPriceSetByOptions[] => {
		const metalCostWithMaterial = JSON.parse(JSON.stringify(costSettingsItem.metalCost.material));
		const keysOfMetalCostMaterial = Object.keys(metalCostWithMaterial);
		return [...pricesByOption].map((item, idx) => {
			const key = keysOfMetalCostMaterial[idx];
			const val = parseInt(metalCostWithMaterial[key]);
			item.metalCost = val || 0;
			return item;
		});
	};

	return (
		<Card
			actions={[
				<Button type='primary' onClick={handleConstructorPrice}>
					Обновить данные в БД
				</Button>,
			]}
			className={styles.price}
			title={constructorStore.constructorPrice.attributes.name}
		>
			<h4>Диаметр задвижки: {constructorStore.constructorPrice.attributes.masterOptionValue}</h4>
			<Tag color='orange'>{constructorStore.constructorPrice.attributes.level}</Tag>
		</Card>
	);
};

export default observer(ConstructorPriceCard);
