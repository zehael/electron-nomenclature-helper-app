import React, { useState } from 'react';
import { Avatar, Button, Form, List, message, Select, Upload } from 'antd';
import { DeleteOutlined, InboxOutlined, TableOutlined } from '@ant-design/icons';
import styles from './ConstructorPrice.module.scss';
import type { RcFile, UploadFile } from 'antd/es/upload/interface';

const ConstructorPriceForm = () => {
	const [fileList, setFileList] = useState<UploadFile[]>([]);
	const [form] = Form.useForm();

	const onFinish = (values: any) => {
		console.log('Success:', values);
	};

	const onFinishFailed = (errorInfo: any) => {
		console.log('Failed:', errorInfo);
	};

	const normFile = (e: any) => {
		console.log('Upload event:', e);
		if (Array.isArray(e)) {
			return e;
		}
		const isExcelType = e.file.type === 'application/vnd.ms-excel';
		if (e?.fileList.length && isExcelType) {
			setFileList(e?.fileList);
		} else {
			clearFiles();
		}
		return e?.fileList;
	};

	const beforeUpload = (file: RcFile) => {
		const isExcelType = file.type === 'application/vnd.ms-excel';
		if (!isExcelType) {
			message.error('Можно загружать только файлы формата xls или xlsx!');
		}
		const isLt2M = file.size / 1024 / 1024 < 48;
		if (!isLt2M) {
			message.error('Максимально допустимый размер файла 48MB!');
		}
		return isExcelType && isLt2M;
	};

	const handleRequest = (options: any) => {
		return new Promise(resolve => {
			resolve('ok');
		});
	};

	const clearFiles = () => {
		setFileList([]);
		form.setFieldsValue({ dragger: null });
	};

	return (
		<div className={styles.form}>
			<Form
				name='constructor-price'
				layout='vertical'
				form={form}
				initialValues={{ remember: true }}
				onFinish={onFinish}
				onFinishFailed={onFinishFailed}
				autoComplete='off'
			>
				<Form.Item label='Режим работы' name='workMode' rules={[{ required: true, message: '' }]} initialValue='one'>
					<Select>
						<Select.Option value='one'>Конкретная строка</Select.Option>
						<Select.Option value='may'>Все строки</Select.Option>
					</Select>
				</Form.Item>
				<Form.Item
					name='dragger'
					label='Таблица с номенклатурой (товары ТУ)'
					valuePropName='fileList'
					getValueFromEvent={normFile}
					rules={[{ required: true, message: 'Прикрепите пожалуйста файл excel' }]}
					noStyle={fileList.length > 0}
				>
					{fileList.length === 0 && (
						<Upload.Dragger beforeUpload={beforeUpload} maxCount={1} customRequest={handleRequest} fileList={fileList}>
							<p className='ant-upload-drag-icon'>
								<InboxOutlined />
							</p>
							<p className='ant-upload-text'>Клик по области или перетащите файл для загрузки</p>
							<p className='ant-upload-hint'>Перетащите файл для загрузки. В форамте .xls или .xlsx до 48МБ.</p>
						</Upload.Dragger>
					)}
				</Form.Item>
				{fileList.length > 0 && (
					<Form.Item label='Таблица с номенклатурой (товары ТУ)'>
						<List
							itemLayout='horizontal'
							dataSource={fileList}
							renderItem={item => (
								<List.Item
									actions={[
										<Button
											shape='circle'
											size='small'
											type='link'
											danger
											icon={<DeleteOutlined />}
											onClick={clearFiles}
										/>,
									]}
								>
									<List.Item.Meta
										avatar={
											<Avatar
												style={{ backgroundColor: '#27ae60', verticalAlign: 'middle' }}
												icon={<TableOutlined />}
											/>
										}
										title={item.name}
										description='Таблица с номенклатурой'
									/>
								</List.Item>
							)}
						/>
					</Form.Item>
				)}
				<div className={styles.form__actions}>
					<Form.Item>
						<Button type='primary' htmlType='submit'>
							Запустить
						</Button>
					</Form.Item>
				</div>
			</Form>
		</div>
	);
};

export default ConstructorPriceForm;
