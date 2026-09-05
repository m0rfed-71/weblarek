import { Api } from './base/Api';
import { IOrder, IOrderResult, IProductsResponse } from '../types';
import { API_URL } from '../utils/constants';

/**
 * Слой общения с сервером: запросы к API магазина.
 */
export class Communication {
    protected api: Api;

    constructor() {
        this.api = new Api(API_URL);
    }

    getProducts(): Promise<IProductsResponse> {
        return this.api.get<IProductsResponse>('/product/');
    }

    postOrder(order: IOrder): Promise<IOrderResult> {
        return this.api.post<IOrderResult>('/order', order);
    }
}
