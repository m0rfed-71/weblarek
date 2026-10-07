import { ensureElement } from "../../utils/utils";
import { Card, ICard } from "./Card";

export interface IProductPreview {
    description: string;
    button: string;
}

export class ProductPreview extends Card implements IProductPreview {
    protected textElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;

    constructor(container: HTMLElement, onButtonClick?: () => void) {
        super(container);
        this.textElement = ensureElement<HTMLElement>('.card__text', this.container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);

        if (onButtonClick) {
            this.buttonElement.addEventListener('click', onButtonClick);
        }
    }
/*уточнить эти методы, возможно им тут не место особенно get */
    get description(): string {
        return this.textElement.textContent ?? '';
    }

    set description(value: string) {
        this.textElement.textContent = value;
    }

    get button(): string {
        return this.buttonElement.textContent ?? '';
    }

    set button(value: string) {
        this.buttonElement.textContent = value;
    }

    protected set price(value: number | null) {
        super.price = value;
        this.buttonElement.disabled = value === null;
        if (value === null) {
            this.buttonElement.textContent = 'Недоступно';
        }
    }
/*уточнить этот момент, возможно его нужно вынести в presenter */
    render(data?: Partial<ICard & IProductPreview>): HTMLElement {
        super.render(data);
        if (data?.price === null) {
            this.buttonElement.textContent = 'Недоступно';
        }
        return this.container;
    }
}
