import { IEvents } from '../base/Events';
import { IBuyer, TPayment, ValidateBuyer } from '../../types';

/**
 * Модель покупателя: способ оплаты, адрес, телефон и email.
 */
export class Buyer {
    protected payment: TPayment | '' = '';
    protected email = '';
    protected phone = '';
    protected address = '';

    constructor(protected events: IEvents) {}

    setData(data: Partial<IBuyer>): void {
        if (data.payment !== undefined) this.payment = data.payment;
        if (data.email !== undefined) this.email = data.email;
        if (data.phone !== undefined) this.phone = data.phone;
        if (data.address !== undefined) this.address = data.address;
        this.events.emit('buyer:change');
    }

    getData() {
        return {
            payment: this.payment,
            email: this.email,
            phone: this.phone,
            address: this.address,
        };
    }

    clear(): void {
        this.payment = '';
        this.email = '';
        this.phone = '';
        this.address = '';
        this.events.emit('buyer:change');
    }

    validate(): ValidateBuyer {
        const errors: ValidateBuyer = {};

        if (!this.payment) {
            errors.payment = 'Необходимо выбрать способ оплаты';
        }

        if (!this.email.trim()) {
            errors.email = 'Необходимо указать email';
        }

        if (!this.phone.trim()) {
            errors.phone = 'Необходимо указать телефон';
        }

        if (!this.address.trim()) {
            errors.address = 'Необходимо указать адрес';
        }

        return errors;
    }
}
