import { Component } from "../base/Component";
import { ICardCatalog } from "../../types";

export class CardCatalog extends Component<ICardCatalog> {
    constructor(container: HTMLElement) {
        super(container);
    }
    protected set items(items: HTMLElement[]) {
        this.container.replaceChildren(...items);
    }
}
