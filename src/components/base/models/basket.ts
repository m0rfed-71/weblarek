import { IProduct } from '../../../types';

/**
 * Модель корзины: товары, выбранные покупателем для покупки.
 */
export class Basket {
    protected items: IProduct[] = [];

    getItems(): IProduct[] {
        return this.items;
    }

    addItem(item: IProduct): void {
        this.items.push(item);
    }

    removeItem(item: IProduct): void {
        this.items = this.items.filter((product) => product.id !== item.id);
    }

    clear(): void {
        this.items = [];
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
