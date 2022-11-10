import React, { FC, useEffect, useMemo, useState } from 'react';
import { Button, Card, Col, Divider, Form, InputNumber, Row, Select, Tag } from 'antd';
import { useStore } from '../../store';
import styles from './ConstructorPrice.module.scss';
import { observer } from 'mobx-react-lite';
import useExcelFile from '../../hooks/useExcelFile';

interface ExcelWorkFromProps {
	rowCount: number;
}

const ExcelWorkForm: FC<ExcelWorkFromProps> = ({ rowCount }) => {
	const { excelStore } = useStore();
	const { defineWorkCostAndMetalCost, handleProductRow } = useExcelFile();
	const [workMode, setWorkMode] = useState<string>('one');
	const [cellNumber, setCellNumber] = useState<number>(1);
	const [form] = Form.useForm();

	useEffect(() => {
		form.setFieldValue('rowNumber', excelStore.currentRowNum);
	}, [excelStore.currentRowNum]);

	const onSelect = (val: string) => {
		setWorkMode(val);
	};

	const setRow = (val: number) => {
		excelStore.SET_CURRENT_ROW_NUM(val);
	};

	const setCell = (val: number) => {
		setCellNumber(val);
	};

	const onFinish = async (values: any) => {
		await handleProductRow(excelStore.ws, values.rowNumber);
	};

	const onFinishFailed = (errorInfo: any) => {
		console.log('Failed:', errorInfo);
	};

	const cellValue = useMemo<string>(() => {
		if (excelStore.ws) {
			const row = excelStore.ws.getRow(excelStore.currentRowNum);
			const cell = row.getCell(cellNumber);
			console.log('cell is', cell.value);
			return String(cell.value) || cell.formula || 'n/a';
		}

		return 'n/a';
	}, [excelStore.currentRowNum, cellNumber]);

	const changeWorksheet = (worksheetId: string | number) => {
		const worksheet = excelStore.worksheetList.find(item => item.id.toString() === worksheetId.toString());
		if (worksheet) {
			excelStore.SET_WORKSHEET(worksheet);
			defineWorkCostAndMetalCost(worksheet);
		}
	};

	return (
		<Form form={form} layout='vertical' onFinish={onFinish} onFinishFailed={onFinishFailed} className={styles.form}>
			<Form.Item label='Режим работы' name='workMode' rules={[{ required: true, message: '' }]} initialValue={workMode}>
				<Select onSelect={onSelect}>
					<Select.Option value='one'>Конкретная строка</Select.Option>
					<Select.Option value='many'>Все строки</Select.Option>
				</Select>
			</Form.Item>
			{excelStore.worksheetList.length > 0 && (
				<Form.Item
					label='Лист'
					name='workSheet'
					rules={[{ required: true, message: '' }]}
					initialValue={excelStore.ws.id}
				>
					<Select onSelect={changeWorksheet}>
						{excelStore.worksheetList.map(item => (
							<Select.Option key={item.id} value={item.id}>
								{item.name}
							</Select.Option>
						))}
					</Select>
				</Form.Item>
			)}
			{workMode === 'one' && (
				<Row gutter={[20, 0]}>
					<Col xs={{ span: 24 }} md={{ span: 8 }}>
						<Form.Item name='rowNumber' label='№ Строки' initialValue={1} rules={[{ required: true }]}>
							<InputNumber value={excelStore.currentRowNum} onChange={setRow} min={1} max={rowCount} />
						</Form.Item>
					</Col>
					<Col xs={{ span: 24 }} md={{ span: 8 }}>
						<Form.Item name='cellNumber' label='№ ячейки' initialValue={1} rules={[{ required: true }]}>
							<InputNumber value={cellNumber} onChange={setCell} min={1} max={200} />
						</Form.Item>
					</Col>
					<Col xs={{ span: 24 }} md={{ span: 8 }}>
						<Form.Item label='Значение ячейки'>
							<Tag className={styles.form__tag} color='green'>
								{JSON.stringify(cellValue)}
							</Tag>
						</Form.Item>
					</Col>
				</Row>
			)}
			{workMode === 'many' && (
				<Row gutter={[20, 0]}>
					<Col xs={{ span: 24 }} md={{ span: 8 }}>
						<Form.Item name='rowStartNumber' label='С какой строки начать' rules={[{ required: true }]}>
							<InputNumber min={1} max={rowCount} />
						</Form.Item>
					</Col>
				</Row>
			)}
			<Divider />
			<Row gutter={[20, 0]}>
				<Col xs={{ span: 24 }} md={{ span: 8 }}>
					<Card size='small' title='Количество строк'>
						<h3>{rowCount}</h3>
					</Card>
				</Col>
				{excelStore.workMetalCostSettings.map(item => (
					<Col xs={{ span: 24 }} md={{ span: 8 }} key={item.name}>
						<Card size='small' title={item.displayName}>
							<Tag color='green'>
								<strong>Стоимость работ</strong> <span>{item.workCost}</span>
							</Tag>
							<h4 className={styles.form__subheading}>Стоимость металла</h4>
							<Tag color='orange'>
								<strong>Материал У:</strong> <span>{item.metalCost.material.u}</span>
							</Tag>
							<Tag color='orange'>
								<strong>Материал ХЛ:</strong> <span>{item.metalCost.material.hl}</span>
							</Tag>
							<Tag color='orange'>
								<strong>Мериал НЖ:</strong> <span>{item.metalCost.material.nz}</span>
							</Tag>
						</Card>
					</Col>
				))}
			</Row>
			<div className={styles.form__actions}>
				<Form.Item>
					<Button type='primary' htmlType='submit'>
						Взять в работу строку
					</Button>
				</Form.Item>
			</div>
		</Form>
	);
};

export default observer(ExcelWorkForm);
