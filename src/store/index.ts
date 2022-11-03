import AppStore from './AppStore';
import { createContext, useContext } from 'react';
import ExcelStore from './ExcelStore';

interface RootState {
	appStore: AppStore;
	excelStore: ExcelStore;
}

const appStore = new AppStore();
const excelStore = new ExcelStore();

export const stories: RootState = {
	appStore,
	excelStore,
};

export const Context = createContext<RootState>({
	...stories,
});

export const useStore = () => {
	return useContext(Context);
};
