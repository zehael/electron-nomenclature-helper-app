import AppStore from './AppStore';
import { createContext, useContext } from 'react';

interface RootState {
	appStore: AppStore;
}

const appStore = new AppStore();

export const stories: RootState = {
	appStore,
};

export const Context = createContext<RootState>({
	...stories,
});

export const useStore = () => {
	return useContext(Context);
};
