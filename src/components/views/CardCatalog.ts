import { Component } from "../base/Component";

interface ICardCatalog {
    items: HTMLElement[];
}

export class CardCatalog extends Component<ICardCatalog> {
    constructor(container: HTMLElement) {
        super(container);
    }
    protected set items(items: HTMLElement[]) {
        this.container.replaceChildren(...items);
    }
}
//import { categoryMap } from "../../utils/constants";
//import { IProduct } from "../../types";
//import { Card } from "./Card";
//import { ensureElement } from "../../utils/utils";

//export type CategoryKey = keyof typeof categoryMap;
//export type TCardCatalog = Pick<IProduct, 'image' | 'category'> ;

//export class CardCatalog extends Card<TCardCatalog> {
    //protected imageElement: HTMLImageElement;
    //protected categoryElement: HTMLElement;

    //constructor(container: HTMLElement, actions?: ICardActions) {
        //super(container);
        //this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        //this.imageElement= ensureElement<HTMLImageElement>('.card__image', this.container);
        //if (actions?.onClick) {
            //this.container.addEventListener('click', actions.onClick);
        //}
    //}

    //set category(value:string) {
        //this.categoryElement.classList.toggle (
            //categoryMap[key as CategoryKey],
            //key === value
        //);
    //}

    //set image(value:string) {
        //this.setImage(this.imageElement, value,this.title);
    //}
//}