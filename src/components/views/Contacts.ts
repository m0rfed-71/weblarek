import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';
import { Form } from './Form';
import { IContactsForm } from '../../types';

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
		if (this.emailInput.value !== value) {
			this.emailInput.value = value;
		}
	}

	set phone(value: string) {
		if (this.phoneInput.value !== value) {
			this.phoneInput.value = value;
		}
	}
}
