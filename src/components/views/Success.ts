import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ISuccess } from '../../types';

/**
 * Экран успешного заказа: сумма списания и возврат в каталог.
 */
export class Success extends Component<ISuccess> {
	protected descriptionElement: HTMLElement;
	protected closeButton: HTMLButtonElement;

	constructor(protected events: IEvents, container: HTMLElement) {
		super(container);

		this.descriptionElement = ensureElement<HTMLElement>(
			'.order-success__description',
			this.container
		);
		this.closeButton = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			this.container
		);

		this.closeButton.addEventListener('click', () => {
			this.events.emit('success:close');
		});
	}

	set total(value: number) {
		const amount = new Intl.NumberFormat('ru-RU').format(value);
		this.descriptionElement.textContent = `Списано ${amount} синапсов`;
	}
}
