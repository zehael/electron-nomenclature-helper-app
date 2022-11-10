import { makeAutoObservable } from 'mobx';
import ApiService from '../services/api';
import { IConstructorPrice, IConstructorPriceRow } from '../types/constructor';
import { message } from 'antd';

const apiService = new ApiService();

export default class ConstructorStore {
	constructorPrice: IConstructorPrice | null = null;
	constructorPriceRows: IConstructorPriceRow[] = [];

	constructor() {
		makeAutoObservable(this);
	}

	SET_CONSTRUCTOR_PRICE(payload: IConstructorPrice) {
		this.constructorPrice = payload;
	}

	SET_CONSTRUCTOR_PRICE_ROWS(payload: IConstructorPriceRow[]) {
		this.constructorPriceRows = payload;
	}

	UPDATE_CONSTRUCTOR_PRICE_ROW(payload: IConstructorPriceRow) {
		this.constructorPriceRows = this.constructorPriceRows.map(item => {
			if (item.constructorPrice.id === payload.constructorPrice.id) {
				return payload;
			}
			return item;
		});
	}

	checkConstructorPriceUpdatedInRow(constructorPriceId: number) {
		return this.constructorPriceRows.filter(item => item.constructorPrice.id === constructorPriceId).length > 0;
	}

	async fetchProductPrice(latchDiameter: number, productName: string, rowNumber: number) {
		const resp = await apiService.fetchConstructorPriceSettings(latchDiameter, productName);
		if (resp && resp.data.length) {
			const constructorPriceItemFromDb = resp.data[0];
			this.SET_CONSTRUCTOR_PRICE(constructorPriceItemFromDb);
			const itemInRow = this.checkConstructorPriceUpdatedInRow(constructorPriceItemFromDb.id);
			if (itemInRow) {
				message.info('Товар был обработан ранее');
				return;
			}
			const adminUrl = process.env.ELECTRON_WEBPACK_APP_ADMIN_HOST_URL;
			const contentTypePath = '/content-manager/collectionType/api::constructor-price.constructor-price/';
			const row: IConstructorPriceRow = {
				constructorPrice: this.constructorPrice,
				updated: false,
				externalProductLink: `${adminUrl}${contentTypePath}${this.constructorPrice.id}`,
				rowNumber,
			};
			this.SET_CONSTRUCTOR_PRICE_ROWS([row, ...this.constructorPriceRows]);
		}
	}

	async updateConstructorPrice(id: number, updateDto: any) {
		const row = this.constructorPriceRows.find(item => item.constructorPrice.id === id);
		if (row && row.updated) {
			message.warn('Элемент уже обновлен в БД');
			return;
		}
		if (row && !row.updated) {
			await apiService.updateConstructorPrice(id, updateDto);
			this.UPDATE_CONSTRUCTOR_PRICE_ROW({ ...row, updated: true });
		}
	}
}
