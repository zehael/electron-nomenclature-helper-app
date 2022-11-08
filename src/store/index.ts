import AppStore from './AppStore';
import { createContext, useContext } from 'react';
import ExcelStore from './ExcelStore';
import ConstructorStore from './ConstructorStore';

interface RootState {
	appStore: AppStore;
	excelStore: ExcelStore;
	constructorStore: ConstructorStore;
}

const appStore = new AppStore();
const excelStore = new ExcelStore();
const constructorStore = new ConstructorStore();

export const stories: RootState = {
	appStore,
	excelStore,
	constructorStore,
};

export const Context = createContext<RootState>({
	...stories,
});

export const useStore = () => {
	return useContext(Context);
};
