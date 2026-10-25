import { TPayment } from '../../types';
import { ensureAllElements, ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';
import { Form } from './Form';
import { IOrderForm } from '../../types';

/**
 * Первый шаг заказа: способ оплаты и адрес доставки.
 */
export class Order extends Form<IOrderForm> {
	protected paymentButtons: HTMLButtonElement[];
	protected addressInput: HTMLInputElement;

	constructor(events: IEvents, container: HTMLFormElement) {
		super(events, container);

		this.paymentButtons = ensureAllElements<HTMLButtonElement>(
			'.button_alt',
			this.container
		);
		this.addressInput = ensureElement<HTMLInputElement>(
			'input[name="address"]',
			this.container
		);

		this.paymentButtons.forEach((button) => {
			button.addEventListener('click', () => {
				this.payment = button.name as TPayment;
				this.onInputChange('payment', button.name);
			});
		});
	}

	set payment(value: TPayment | '') {
		this.paymentButtons.forEach((button) => {
			button.classList.toggle('button_alt-active', button.name === value);
		});
	}

	set address(value: string) {
		if (this.addressInput.value !== value) {
			this.addressInput.value = value;
		}
	}
}
