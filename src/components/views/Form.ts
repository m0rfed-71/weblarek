import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export interface IFormState {
	valid: boolean;
	errors: string;
}

/**
 * Базовая форма: валидность, ошибки, ввод и submit через события.
 */
export class Form<T> extends Component<T & IFormState> {
	protected submitButton: HTMLButtonElement;
	protected errorsElement: HTMLElement;
	protected formName: string;

	constructor(protected events: IEvents, container: HTMLFormElement) {
		super(container);
		this.formName = container.name;

		this.submitButton = ensureElement<HTMLButtonElement>(
			'button[type=submit]',
			this.container
		);
		this.errorsElement = ensureElement<HTMLElement>(
			'.form__errors',
			this.container
		);

		this.container.addEventListener('input', (event: Event) => {
			const target = event.target as HTMLInputElement;
			this.onInputChange(target.name as keyof T, target.value);
		});

		this.container.addEventListener('submit', (event: Event) => {
			event.preventDefault();
			this.events.emit(`${this.formName}:submit`);
		});
	}

	protected onInputChange(field: keyof T, value: string): void {
		this.events.emit(`${this.formName}.${String(field)}:change`, {
			field,
			value,
		});
	}

	set valid(value: boolean) {
		this.submitButton.disabled = !value;
	}

	set errors(value: string) {
		this.errorsElement.textContent = value;
	}
}
