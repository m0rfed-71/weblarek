import { ensureElement } from '../../utils/utils';
import { IBasketItem, ICard } from '../../types';
import { Card } from './Card';

/**
 * Строка товара в корзине: номер, название, цена и удаление.
 */
export class BasketItem extends Card<ICard & IBasketItem> {
    protected indexElement: HTMLElement;
    protected deleteButton: HTMLButtonElement;

    protected findImageAndCategory(): void {}

    constructor(container: HTMLElement, onDelete?: () => void) {
        super(container);

        this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

        if (onDelete) {
            this.deleteButton.addEventListener('click', onDelete);
        }
    }

    set index(value: number) {
        this.indexElement.textContent = String(value);
    }
}
