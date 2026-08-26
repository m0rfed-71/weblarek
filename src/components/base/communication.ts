import { Api } from './Api';
import { IOrder, IOrderResult, IProductsResponse } from '../../types';
import { API_URL } from '../../utils/constants';

/**
 * Слой общения с сервером: запросы к API магазина.
 */
export class Communication {
    protected api: Api;

    constructor() {
        this.api = new Api(API_URL);
    }

    get(): Promise<IProductsResponse> {
        return this.api.get<IProductsResponse>('/product/');
    }

    post(order: IOrder): Promise<IOrderResult> {
        return this.api.post<IOrderResult>('/order', order);
    }
}
