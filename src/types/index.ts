import { categoryMap } from '../utils/constants';

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: CategoryKey;
    price: number | null;
}

export interface IProductsResponse {
    total: number;
    items: IProduct[];
}

export type TPayment = 'card' | 'cash';

export interface IBuyer {
    payment: TPayment | '';
    email: string;
    phone: string;
    address: string;    
}

export type ValidateBuyer = Partial<Record<keyof IBuyer, string>>;

export interface IOrder {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
}

export interface IOrderResult {
    id: string;
    total: number;
}

export interface IBasketView {
    items: HTMLElement[];
    total: number;
}

export type CategoryKey = keyof typeof categoryMap;

export interface ICard {
    title: string;
    image: string;
    category: CategoryKey;
    price: number | null;
}
export type ICardBase = Pick<ICard, 'title' | 'price'>;

export interface IBasketItem extends Pick<ICard, 'title' | 'price'> {
    index: number;
}

export interface ICardCatalog {
    items: HTMLElement[];
}

export interface IContactsForm {
	email: string;
	phone: string;
}

export interface IHeader {
    counter: number;
}

export interface IModal {
    content: HTMLElement;
}

export interface IOrderForm {
	payment: TPayment | '';
	address: string;
}

export interface IProductPreview extends ICard {
    description: string;
    button: string;
}

export interface ISuccess {
	total: number;
}