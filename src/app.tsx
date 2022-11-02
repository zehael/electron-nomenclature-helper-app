import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.scss';
import { Layout, Tabs } from 'antd';
import ConstructorPriceView from './features/constructor-price/ConstructorPriceView';
import { Context, stories } from './store';

const App = () => {
	const items = [
		{ label: 'Конструктор цен', key: '1', children: <ConstructorPriceView /> }, // remember to pass the key prop
		{ label: 'Настройки', key: 'item-2', children: 'Здесь будет дополнительный контент' },
	];
	return (
		<Context.Provider value={{ ...stories }}>
			<Layout>
				<Tabs defaultActiveKey='1' items={items} />
			</Layout>
		</Context.Provider>
	);
};

const container = document.getElementById('root');
if (!container) {
	throw Error('Root container is not exists');
}
const root = createRoot(container);

root.render(<App />);
