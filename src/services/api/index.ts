import QueryStringService, { QueryTypes } from './QueryStringService';

const queriesService = new QueryStringService();

export default class ApiService {
	apiUrl: string = process.env.ELECTRON_WEBPACK_APP_API_URL;
	apiToken: string = process.env.ELECTRON_WEBPACK_APP_KEY;

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

	async updateConstructorPrice(id: number, updatedParams: any) {
		if (!this.apiToken) {
			throw new Error('apiToken is empty');
		}

		const resp = await fetch(`${this.apiUrl}/constructor-prices/${id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${this.apiToken}`,
			},
			body: JSON.stringify(updatedParams),
		});

		return await resp.json();
	}
}
