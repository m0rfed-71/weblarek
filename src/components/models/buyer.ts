import { IBuyer, TPayment } from '../../types';

/**
 * Модель покупателя: способ оплаты, адрес, телефон и email.
 */
export class Buyer {
    protected payment: TPayment | '' = '';
    protected email = '';
    protected phone = '';
    protected address = '';

    setData(data: Partial<IBuyer>): void {
        if (data.payment !== undefined) this.payment = data.payment;
        if (data.email !== undefined) this.email = data.email;
        if (data.phone !== undefined) this.phone = data.phone;
        if (data.address !== undefined) this.address = data.address;
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
    }

    validate(): Partial<Record<keyof IBuyer, string>> {
        const errors: Partial<Record<keyof IBuyer, string>> = {};

        if (!this.payment) {
            errors.payment = 'Выберите выбрать способ оплаты';
        }

        if (!this.email) {
            errors.email = 'Необходимо указать email';
        }

        if (!this.phone) {
            errors.phone = 'Необходимо указать телефон';
        }

        if (!this.address) {
            errors.address = 'Необходимо указать адрес';
        }

        return errors;
    }
}
