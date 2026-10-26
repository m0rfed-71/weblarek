import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { categoryMap } from "../../utils/constants";
import { CategoryKey, ICard } from "../../types";

export class Card<T extends ICard = ICard> extends Component<T> {
    protected titleElement: HTMLElement;
    protected imageElement?: HTMLImageElement;
    protected categoryElement?: HTMLElement;
    protected priceElement: HTMLElement;

    constructor(container: HTMLElement, onClick?: () => void) {
        super(container);
        this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
        this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);
        this.findImageAndCategory();
        if (onClick) {
            this.container.addEventListener('click', onClick);
        }
    }

    protected findImageAndCategory(): void {
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
    }

    protected set title(value: string) {
        this.titleElement.textContent = value;
    }

    protected set image(value: string) {
        if (this.imageElement) {
            this.imageElement.src = value;
        }
    }

    protected set category(value: CategoryKey) {
        if (!this.categoryElement) {
            return;
        }
        this.categoryElement.textContent = value;
        this.categoryElement.className = `card__category ${categoryMap[value]}`;
    }

    protected set price(value: number | null) {
        this.priceElement.textContent = value === null ? 'Бесценно' : `${value} синапсов`;
    }
} 
