import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../store';
import { Button, Card, Tag } from 'antd';
import styles from './ConstructorPrice.module.scss';
import useConstructorPrice from '../../hooks/useConstructorPrice';

const ConstructorPriceCard = () => {
	const { handleConstructorPrice } = useConstructorPrice();
	const { constructorStore } = useStore();

	if (!constructorStore.constructorPrice) {
		return null;
	}

	return (
		<Card
			size='small'
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
