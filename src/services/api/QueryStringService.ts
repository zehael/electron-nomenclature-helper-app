import qs from 'qs';

export enum QueryTypes {
	FETCH_CONSTRUCTOR_PRICE = 'FETCH_CONSTRUCTOR_PRICE',
}

const productOptionQueryParams: any = {
	fields: ['name', 'slug'],
	populate: {
		unit: {
			fields: ['name', 'pluralName'],
		},
	},
};

const constructorPriceQueryParams = {
	fields: ['title', 'level', 'masterOptionValue', 'name'],
	populate: {
		masterConstructor: {
			fields: ['id', 'title'],
		},
		masterOption: {
			...productOptionQueryParams,
		},
		priceList: {
			fields: ['name', 'price', 'weight', 'costOfWork'],
			populate: {
				pricesByOption: {
					fields: ['optionValue', 'price', 'metalCost'],
					populate: {
						option: {
							...productOptionQueryParams,
						},
					},
				},
				dynamicPriceByWeight: {
					fields: ['weightParam1', 'weightParam2', 'weightParam3', 'formulaCode'],
				},
			},
		},
	},
};

export default class QueryStringService {
	createQuery(type: QueryTypes, updateQueryParam?: any): string {
		let queryString = '';
		switch (type) {
			case QueryTypes.FETCH_CONSTRUCTOR_PRICE:
				queryString = qs.stringify({ ...constructorPriceQueryParams, ...updateQueryParam }, { encodeValuesOnly: true });
				break;
			default:
				break;
		}

		return '?' + queryString;
	}
}
