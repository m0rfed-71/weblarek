import { IApi, IOrder, IOrderResult, IProductsResponse } from '../types';

/**
 * Слой общения с сервером: запросы к API магазина.
 */
export class Communication {
    protected api: IApi;

    constructor(api: IApi) {
        this.api = api;
    }

    getProducts(): Promise<IProductsResponse> {
        return this.api.get<IProductsResponse>('/product/');
    }

    postOrder(order: IOrder): Promise<IOrderResult> {
        return this.api.post<IOrderResult>('/order', order);
    }
}
