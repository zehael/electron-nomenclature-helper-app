import React, { FC, useMemo, useState } from 'react';
import { Button, Col, Form, InputNumber, Row, Select, Tag } from 'antd';
import { useStore } from '../../store';
import styles from './ConstructorPrice.module.scss';
import { observer } from 'mobx-react-lite';

interface ExcelWorkFromProps {
	rowCount: number;
}

const ExcelWorkForm: FC<ExcelWorkFromProps> = ({ rowCount }) => {
	const { excelStore } = useStore();
	const [workMode, setWorkMode] = useState<string>('one');
	const [rowNumber, setRowNumber] = useState<number>(1);
	const [cellNumber, setCellNumber] = useState<number>(1);

	const onSelect = (val: string) => {
		setWorkMode(val);
	};

	const onFinish = async (values: any) => {
		console.log('Success:', values);
	};

	const onFinishFailed = (errorInfo: any) => {
		console.log('Failed:', errorInfo);
	};

	const cellValue = useMemo<string>(() => {
		if (excelStore.ws) {
			const row = excelStore.ws.getRow(rowNumber);
			const cell = row.getCell(cellNumber);
			return cell.value.toString();
		}

		return 'n/a';
	}, [rowNumber, cellNumber]);

	return (
		<Form layout='vertical' onFinish={onFinish} onFinishFailed={onFinishFailed} className={styles.form}>
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
					<Select onSelect={onSelect}>
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
							<InputNumber value={rowNumber} onChange={val => setRowNumber(val)} min={1} max={rowCount} />
						</Form.Item>
					</Col>
					<Col xs={{ span: 24 }} md={{ span: 8 }}>
						<Form.Item name='cellNumber' label='№ ячейки' initialValue={1} rules={[{ required: true }]}>
							<InputNumber value={cellNumber} onChange={val => setCellNumber(val)} min={1} max={200} />
						</Form.Item>
					</Col>
					<Col xs={{ span: 24 }} md={{ span: 8 }}>
						<Form.Item label='Значение ячейки'>
							<Tag className={styles.form__tag} color='green'>
								{cellValue}
							</Tag>
						</Form.Item>
					</Col>
				</Row>
			)}
			<div>Row count: {rowCount}</div>
			{workMode === 'many' && (
				<div>
					<Form.Item name='rowStartNumber' label='С какой строки начать' rules={[{ required: true }]}>
						<InputNumber min={1} max={rowCount} />
					</Form.Item>
				</div>
			)}
			<div className={styles.form__actions}>
				<Form.Item>
					<Button type='primary' htmlType='submit'>
						Запустить
					</Button>
				</Form.Item>
			</div>
		</Form>
	);
};

export default observer(ExcelWorkForm);
