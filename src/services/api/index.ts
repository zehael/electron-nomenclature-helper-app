import QueryStringService, { QueryTypes } from './QueryStringService';

const queriesService = new QueryStringService();

export default class ApiService {
	apiUrl: string = process.env.ELECTRON_WEBPACK_APP_API_URL;

	async fetchConstructorPriceSettings(latchDiameter: number, productName: string) {
		const filtersParams = {
			masterOptionValue: {
				$eq: latchDiameter,
			},
			name: {
				$eq: productName,
			},
		};
		const query = queriesService.createQuery(QueryTypes.FETCH_CONSTRUCTOR_PRICE, { filters: filtersParams });
		const response = await fetch(this.apiUrl + '/constructor-prices' + query);
		return await response.json();
	}
}
