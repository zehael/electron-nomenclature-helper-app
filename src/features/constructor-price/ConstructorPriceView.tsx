import React, { useEffect } from 'react';
import TableLoadForm from './TableLoadForm';
import ExcelWorkForm from './ExcelWorkForm';
import useExcelFile from '../../hooks/useExcelFile';
import { useStore } from '../../store';
import { observer } from 'mobx-react-lite';
import Loader from '../../components/app/Loader';

const ConstructorPriceView = () => {
	const { excelStore } = useStore();
	const { readFile } = useExcelFile();

	useEffect(() => {
		setTimeout(() => {
			excelStore.SET_LOADING(false);
		}, 550);
	}, []);

	const onReadFile = async () => {
		excelStore.SET_LOADING(true);
		try {
			if (excelStore.filePath) {
				await readFile(excelStore.filePath);
			}
		} catch (e) {
			console.log('e');
		} finally {
			excelStore.SET_LOADING(false);
		}
	};
	return (
		<div className='view'>
			<h3>Редактирование цен конструктора</h3>
			{excelStore.isLoading && <Loader />}
			{excelStore.filePath === '' && !excelStore.isLoading && <TableLoadForm readFile={onReadFile} />}
			{excelStore.filePath !== '' && !excelStore.isLoading && <ExcelWorkForm rowCount={excelStore.ws.rowCount || 10} />}
		</div>
	);
};

export default observer(ConstructorPriceView);
