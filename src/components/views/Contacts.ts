import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';
import { Form } from './Form';

export interface IContactsForm {
	email: string;
	phone: string;
}

/**
 * Второй шаг заказа: email и телефон.
 */
export class Contacts extends Form<IContactsForm> {
	protected emailInput: HTMLInputElement;
	protected phoneInput: HTMLInputElement;

	constructor(events: IEvents, container: HTMLFormElement) {
		super(events, container);

		this.emailInput = ensureElement<HTMLInputElement>(
			'input[name="email"]',
			this.container
		);
		this.phoneInput = ensureElement<HTMLInputElement>(
			'input[name="phone"]',
			this.container
		);
	}

	set email(value: string) {
		this.emailInput.value = value;
	}

	set phone(value: string) {
		this.phoneInput.value = value;
	}
}
