import React from 'react';
import {createRoot} from "react-dom/client";
import './styles/index.scss';

const App = () => {
	return (
		<div>
			<h2>Hello world from react!</h2>
		</div>
	);
};

const container = document.getElementById('root');
if (!container) {
	throw Error('Root container is not exists');
}
const root = createRoot(container);

root.render(<App />);
