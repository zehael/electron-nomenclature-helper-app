import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../store';
import { Button, Card, Tag } from 'antd';
import styles from './ConstructorPrice.module.scss';

const ConstructorPriceCard = () => {
	const { constructorStore, excelStore } = useStore();

	if (!constructorStore.constructorPrice) {
		return null;
	}

	const handleConstructorPrice = () => {
		console.log('cost settings is', excelStore.workMetalCostSettings,);
		const updatedData = JSON.parse(JSON.stringify(constructorStore.constructorPrice.attributes));
		console.log('data for update', updatedData);
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

	return (
		<Card
			actions={[
				<Button type='primary' onClick={handleConstructorPrice}>
					Обновить карточку цены
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
