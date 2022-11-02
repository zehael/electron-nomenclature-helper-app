import { makeAutoObservable } from 'mobx';

export default class AppStore {
	isLoading = false;

	constructor() {
		makeAutoObservable(this);
	}

	SET_LOADING(payload: boolean) {
		this.isLoading = payload;
	}
}
