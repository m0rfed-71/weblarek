import { ensureElement } from "../../utils/utils";
import { IProductPreview } from "../../types";
import { Card } from "./Card";


export class ProductPreview extends Card<IProductPreview> {
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

    protected set description(value: string) {
        this.textElement.textContent = value;
    }

    protected set button(value: string) {
        this.buttonElement.textContent = value;
    }

    protected set price(value: number | null) {
        super.price = value;
        this.buttonElement.disabled = value === null;
    }
}
