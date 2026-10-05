import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { categoryMap } from "../../utils/constants";

export type CategoryKey = keyof typeof categoryMap;
interface ICard {
    title: string;
    image: string;
    category: CategoryKey;
    price: number | null;
}

export class Card extends Component<ICard> {
    protected titleElement: HTMLElement;
    protected imageElement: HTMLImageElement;
    protected categoryElement: HTMLElement;
    protected priceElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
        this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
    }

    protected set title(value: string) {
        this.titleElement.textContent = value;
    }

    protected set image(value: string) {
        this.imageElement.src = value;
    }

    protected set category(value: CategoryKey) {
        this.categoryElement.textContent = value;
        this.categoryElement.className = `card__category ${categoryMap[value]}`;
    }

    protected set price(value: number | null) {
        this.priceElement.textContent = value === null ? 'Бесценно' : `${value} синапсов`;
    }
} 
