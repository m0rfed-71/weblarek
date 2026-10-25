import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { IBasketView } from '../../types';
/**
 * Корзина в модальном окне: список, сумма и кнопка «Оформить».
 */
export class Basket extends Component<IBasketView> {
    protected listElement: HTMLElement;
    protected priceElement: HTMLElement;
    protected orderButton: HTMLButtonElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);

        this.listElement = ensureElement<HTMLElement>('.basket__list', this.container);
        this.priceElement = ensureElement<HTMLElement>('.basket__price', this.container);
        this.orderButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);

        this.orderButton.addEventListener('click', () => {
            this.events.emit('basket:order');
        });
    }

    set items(value: HTMLElement[]) {
        this.listElement.replaceChildren(...value);
        this.orderButton.disabled = value.length === 0;
    }

    set total(value: number) {
        this.priceElement.textContent = `${value} синапсов`;
    }
}
