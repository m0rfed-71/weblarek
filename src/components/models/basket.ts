import { IEvents } from '../base/Events';
import { IProduct } from '../../types';

/**
 * Модель корзины: товары, выбранные покупателем для покупки.
 */
export class Basket {
    protected items: IProduct[] = [];

    constructor(protected events: IEvents) {}

    getItems(): IProduct[] {
        return this.items;
    }

    addItem(item: IProduct): void {
        this.items.push(item);
        this.events.emit('basket:change');
    }

    removeItem(item: IProduct): void {
        this.items = this.items.filter((product) => product.id !== item.id);
        this.events.emit('basket:change');
    }

    clear(): void {
        this.items = [];
        this.events.emit('basket:change');
    }

    getTotal(): number {
        return this.items.reduce((sum, item) => sum + (item.price ?? 0), 0);
    }

    getCount(): number {
        return this.items.length;
    }

    hasItem(id: string): boolean {
        return this.items.some((item) => item.id === id);
    }
}
