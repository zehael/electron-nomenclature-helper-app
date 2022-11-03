import React from 'react';
import s from './Loader.module.scss';
import { Spin } from 'antd';

const Loader = () => {
	return (
		<div className={s.loader}>
			<Spin size='large'></Spin>
		</div>
	);
};

export default Loader;
