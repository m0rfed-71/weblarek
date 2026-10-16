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

	constructor(protected events: IEvents, container: HTMLFormElement) {
		super(container);

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
			this.events.emit(`${this.form.name}:submit`);
		});
	}

	protected get form(): HTMLFormElement {
		return this.container as HTMLFormElement;
	}

	protected onInputChange(field: keyof T, value: string): void {
		this.events.emit(`${this.form.name}.${String(field)}:change`, {
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

	render(state?: Partial<T & IFormState>): HTMLElement {
		const { valid, errors, ...inputs } = state ?? {};
		super.render({ valid, errors } as Partial<T & IFormState>);
		Object.assign(this, inputs);
		return this.container;
	}
}
