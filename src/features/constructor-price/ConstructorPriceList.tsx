import React from 'react';
import { ColumnsType } from 'antd/es/table';
import { Button, Space, Switch, Table, Tag } from 'antd';
import styles from './ConstructorPrice.module.scss';
import { ArrowRightOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import { IConstructorPriceRow } from '../../types/constructor';
import useConstructorPrice from '../../hooks/useConstructorPrice';
import { useStore } from '../../store';
import { shell } from 'electron';
import useExcelFile from '../../hooks/useExcelFile';

const ConstructorPriceList = () => {
	const { constructorStore, excelStore } = useStore();
	const { handleConstructorPrice } = useConstructorPrice();
	const { handleProductRow } = useExcelFile();

	const openExternalLink = async (link: string) => {
		await shell.openExternal(link);
	};

	const getNextRowWithTuProductFromSheet = async () => {
		excelStore.SET_CURRENT_ROW_NUM(excelStore.currentRowNum + 1);
		await handleProductRow(excelStore.ws, excelStore.currentRowNum);
	};

	const updateCurrentRowInDb = async (rowNumber: number) => {
		excelStore.SET_CURRENT_ROW_NUM(rowNumber);
		await handleProductRow(excelStore.ws, rowNumber);
		await handleConstructorPrice();
	};

	const columns: ColumnsType<IConstructorPriceRow> = [
		{
			title: 'Название',
			key: 'name',
			render: (_, { constructorPrice }) => (
				<a>
					<strong>{constructorPrice.attributes.name}</strong>
				</a>
			),
		},
		{
			title: 'Данные',
			key: 'tags',
			render: (_, { constructorPrice }) => (
				<Space direction='vertical' size='small'>
					<Tag color='geekblue'>
						<strong>Диаметр задвижки:</strong> {constructorPrice.attributes.masterOptionValue}
					</Tag>
					<Tag color='volcano'>{constructorPrice.attributes.level}</Tag>
				</Space>
			),
		},
		{
			title: 'Обработан',
			key: 'updated',
			render: (_, { updated }) => <Switch checked={updated} />,
		},
		{
			title: 'Действия',
			key: 'action',
			render: (_, { externalProductLink, rowNumber }) => (
				<Space direction='vertical' size='small'>
					<Button type='link' size='small' onClick={() => openExternalLink(externalProductLink)} target='_blank'>
						Редактировать в админке
					</Button>
					<Button onClick={() => updateCurrentRowInDb(rowNumber)} type='link' size='small'>
						Обновить данные в БД
					</Button>
				</Space>
			),
		},
	];

	return (
		<div className={styles.list}>
			<div className={styles.list__actions}>
				<Button onClick={getNextRowWithTuProductFromSheet} size='small' type='link' icon={<ArrowRightOutlined />}>
					Взять следующую строку
				</Button>
			</div>
			<Table
				columns={columns}
				dataSource={constructorStore.constructorPriceRows}
				rowKey={record => record.constructorPrice.id}
			/>
		</div>
	);
};

export default observer(ConstructorPriceList);
