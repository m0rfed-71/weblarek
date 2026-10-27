import { ensureElement } from "../../utils/utils";
import { categoryMap } from "../../utils/constants";
import { CategoryKey, ICard } from "../../types";
import { Card } from "./Card";

/**
 * Карточка товара с картинкой и категорией.
 * Её используют каталог и подробное превью.
 */
export class ProductCard<T extends ICard = ICard> extends Card<T> {
    protected imageElement: HTMLImageElement;
    protected categoryElement: HTMLElement;

    constructor(container: HTMLElement, onClick?: () => void) {
        super(container, onClick);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
    }

    protected set image(value: string) {
        this.imageElement.src = value;
    }

    protected set category(value: CategoryKey) {
        this.categoryElement.textContent = value;
        this.categoryElement.className = `card__category ${categoryMap[value]}`;
    }
}
