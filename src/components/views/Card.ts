import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { ICardBase } from "../../types";

/**
 * Базовый компонент карточки.
 * Используется в каталоге и подробном превью.
 */
export class Card<T extends ICardBase = ICardBase> extends Component<T> {
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;

    constructor(container: HTMLElement, onClick?: () => void) {
        super(container);
        this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
        this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);
        if (onClick) {
            this.container.addEventListener('click', onClick);
        }
    }

    protected set title(value: string) {
        this.titleElement.textContent = value;
    }

    protected set price(value: number | null) {
        this.priceElement.textContent = value === null ? 'Бесценно' : `${value} синапсов`;
    }
}
