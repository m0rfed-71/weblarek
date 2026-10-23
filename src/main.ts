import './scss/styles.scss';
import { apiProducts } from './utils/data';
import { Catalog } from './components/models/catalog';
import { Buyer } from './components/models/buyer';
import { Basket } from './components/models/basket';
import { IBuyer, IProduct, TPayment } from './types';
import { Communication } from './components/communication';
import { Api } from './components/base/Api';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/Events';
import { Card, CategoryKey } from './components/views/Card';
import { ProductPreview } from './components/views/ProductPreview';
import { Modal } from './components/views/Modal';
import { Header } from './components/views/Header';
import { Basket as BasketView } from './components/views/Basket';
import { BasketItem } from './components/views/BasketItem';
import { Order } from './components/views/Order';
import { Contacts } from './components/views/Contacts';
import { Success } from './components/views/Success';
import { cloneTemplate, ensureElement } from './utils/utils';

/** Проверка методов модели каталога */
const productsModel= new Catalog();
productsModel.setItems(apiProducts.items as IProduct[]);
console.log('Массив товаров из каталога: ',productsModel.getItems());
console.log('Товар из каталога: ',productsModel.getItem('854cef69-976d-4c2a-a18c-2aa45046c390'));
productsModel.setPreview(apiProducts.items[0] as IProduct);
console.log('Превью товара из каталога: ',productsModel.getPreview());

/** Проверка методов модели корзины */
const basketModel = new Basket();
basketModel.addItem(apiProducts.items[0] as IProduct);
console.log('После добавления товаров в корзине: ',basketModel.getItems());
basketModel.removeItem(apiProducts.items[0] as IProduct);
console.log('После удаления товаров в корзине осталось: ',basketModel.getItems());
basketModel.clear();
console.log('После очистки корзины товаров осталось: ',basketModel.getItems());
console.log('Общее количество товаров в корзине: ',basketModel.getCount());
console.log('Общая стоимость товаров в корзине: ',basketModel.getTotal());
console.log('Есть ли товар в корзине? ',basketModel.hasItem('854cef69-976d-4c2a-a18c-2aa45046c390'));

/** Проверка методов модели покупателя */
const buyerModel= new Buyer();
buyerModel.setData({
    payment: 'cash',
    email: 'example@test.com',
    phone: '+7952890700',
    address: 'Kremlin 1'
});
console.log('Данные покупателя после ввода: ',buyerModel.getData());
console.log('Проверка заполнения всех полей: ',buyerModel.validate());
buyerModel.clear();
console.log('Данные покупателя после очистки: ',buyerModel.getData());

const newBuyerModel= new Buyer();
newBuyerModel.setData({
    payment: '',
    email: '',
    phone: '',
    address: ''
});
console.log('Данные покупателя после ввода: ',newBuyerModel.getData());
console.log('Проверка заполнения всех полей: ',newBuyerModel.validate());

/** Проверка методов слоя общения с сервером */
const communication = new Communication(new Api(API_URL));
communication.getProducts().then((data) => {
    productsModel.setItems(data.items);
    console.log('Каталог,  с сервера: ', productsModel.getItems());
}).catch((error: unknown) => {
    console.error('Ошибка загрузки каталога: ', error);
});

/** Корзина и превью товара */
const events = new EventEmitter();
const gallery = ensureElement<HTMLElement>('.gallery');
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'));
const header = new Header(events, ensureElement<HTMLElement>('.header'));
const basketView = new BasketView(events, cloneTemplate('#basket'));
const orderView = new Order(events, cloneTemplate<HTMLFormElement>('#order'));
const contactsView = new Contacts(events, cloneTemplate<HTMLFormElement>('#contacts'));
const successView = new Success(events, cloneTemplate('#success'));

const basketButtonText = (product: IProduct): string => {
    if (product.price === null) {
        return 'Недоступно';
    }
    return basketModel.hasItem(product.id) ? 'Удалить из корзины' : 'В корзину';
};

const renderBasket = (): HTMLElement => {
    const items = basketModel.getItems().map((product, index) => {
        const item = new BasketItem(cloneTemplate('#card-basket'), () => {
            events.emit('basket:remove', { id: product.id });
        });

        return item.render({
            index: index + 1,
            title: product.title,
            price: product.price,
        });
    });

    return basketView.render({
        items,
        total: basketModel.getTotal(),
    });
};

const openPreview = (product: IProduct) => {
    productsModel.setPreview(product);
    const preview = new ProductPreview(cloneTemplate('#card-preview'), () => {
        events.emit('card:basket', { id: product.id });
    });
    modal.content = preview.render({
        title: product.title,
        image: `${CDN_URL}${product.image}`,
        category: product.category as CategoryKey,
        description: product.description,
        price: product.price,
        button: basketButtonText(product),
    });
    modal.open();
};

header.counter = basketModel.getCount();

events.on('basket:open', () => {
    modal.content = renderBasket();
    modal.open();
});

events.on<{ id: string }>('basket:remove', ({ id }) => {
    const product = basketModel.getItems().find((item) => item.id === id);
    if (!product) {
        return;
    }

    basketModel.removeItem(product);
    header.counter = basketModel.getCount();
    modal.content = renderBasket();
});

events.on<{ id: string }>('card:basket', ({ id }) => {
    const product = productsModel.getItem(id) ?? productsModel.getPreview();
    if (!product || product.price === null) {
        return;
    }

    if (basketModel.hasItem(product.id)) {
        basketModel.removeItem(product);
    } else {
        basketModel.addItem(product);
    }

    header.counter = basketModel.getCount();
    openPreview(product);
});

const cards = (apiProducts.items as IProduct[]).map((product) => {
    const component = new Card(cloneTemplate('#card-catalog'), () => openPreview(product));
    return component.render({
        title: product.title,
        image: `${CDN_URL}${product.image}`,
        category: product.category as CategoryKey,
        price: product.price,
    });
});

gallery.replaceChildren(...cards);

/** Оформление заказа */
const stepMessages = (...fields: (keyof IBuyer)[]): string[] => {
    const errors = buyerModel.validate();
    return fields
        .map((field) => errors[field])
        .filter((message): message is string => Boolean(message));
};

const syncOrder = (showErrors: boolean): void => {
    const messages = stepMessages('payment', 'address');
    orderView.valid = messages.length === 0;
    orderView.errors = showErrors ? (messages[0] ?? '') : '';
};

const syncContacts = (showErrors: boolean): void => {
    const messages = stepMessages('email', 'phone');
    contactsView.valid = messages.length === 0;
    contactsView.errors = showErrors ? (messages[0] ?? '') : '';
};

events.on('basket:order', () => {
    const data = buyerModel.getData();
    const messages = stepMessages('payment', 'address');
    const started = Boolean(data.payment || data.address.trim());

    modal.content = orderView.render({
        payment: data.payment,
        address: data.address,
        valid: messages.length === 0,
        errors: started ? (messages[0] ?? '') : '',
    });
    modal.open();
});

events.on<{ value: string }>('order.payment:change', ({ value }) => {
    buyerModel.setData({ payment: value as TPayment });
    syncOrder(true);
});

events.on<{ value: string }>('order.address:change', ({ value }) => {
    buyerModel.setData({ address: value });
    syncOrder(true);
});

events.on('order:submit', () => {
    if (stepMessages('payment', 'address').length > 0) {
        syncOrder(true);
        return;
    }

    const data = buyerModel.getData();
    const messages = stepMessages('email', 'phone');
    const started = Boolean(data.email.trim() || data.phone.trim());

    modal.content = contactsView.render({
        email: data.email,
        phone: data.phone,
        valid: messages.length === 0,
        errors: started ? (messages[0] ?? '') : '',
    });
});

events.on<{ value: string }>('contacts.email:change', ({ value }) => {
    buyerModel.setData({ email: value });
    syncContacts(true);
});

events.on<{ value: string }>('contacts.phone:change', ({ value }) => {
    buyerModel.setData({ phone: value });
    syncContacts(true);
});

events.on('contacts:submit', () => {
    const data = buyerModel.getData();
    if (!data.payment || stepMessages('payment', 'address', 'email', 'phone').length > 0) {
        syncContacts(true);
        return;
    }

    contactsView.valid = false;

    communication
        .postOrder({
            payment: data.payment,
            email: data.email.trim(),
            phone: data.phone.trim(),
            address: data.address.trim(),
            total: basketModel.getTotal(),
            items: basketModel.getItems().map((item) => item.id),
        })
        .then((result) => {
            basketModel.clear();
            buyerModel.clear();
            header.counter = 0;
            modal.content = successView.render({ total: result.total });
        })
        .catch((error: unknown) => {
            syncContacts(true);
            contactsView.errors = typeof error === 'string' ? error : 'Не удалось оформить заказ';
        });
});

events.on('success:close', () => {
    modal.close();
});
