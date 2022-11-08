import { makeAutoObservable } from 'mobx';
import ApiService from '../services/api';
import { IConstructorPrice } from '../types/constructor';

const apiService = new ApiService();

export default class ConstructorStore {
	constructorPrice: IConstructorPrice | null = null;

	constructor() {
		makeAutoObservable(this);
	}

	SET_CONSTRUCTOR_PRICE(payload: any) {
		this.constructorPrice = payload;
	}

	async fetchProductPrice(latchDiameter: number, productName: string) {
		const resp = await apiService.fetchConstructorPriceSettings(latchDiameter, productName);
		if (resp && resp.data.length) {
			this.SET_CONSTRUCTOR_PRICE(resp.data[0]);
		}
	}
}
