import './scss/styles.scss';
import { apiProducts } from './utils/data';
import { Catalog } from './components/models/catalog';
import { Buyer } from './components/models/buyer';
import { Basket } from './components/models/basket';
import { CategoryKey, IBuyer, IProduct, TPayment } from './types';
import { Communication } from './components/communication';
import { Api } from './components/base/Api';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/Events';
import { ProductCard } from './components/views/ProductCard';
import { ProductPreview } from './components/views/ProductPreview';
import { Modal } from './components/views/Modal';
import { Header } from './components/views/Header';
import { Basket as BasketView } from './components/views/Basket';
import { BasketItem } from './components/views/BasketItem';
import { Order } from './components/views/Order';
import { Contacts } from './components/views/Contacts';
import { Success } from './components/views/Success';
import { cloneTemplate, ensureElement } from './utils/utils';


const communication = new Communication(new Api(API_URL));


/** Корзина и превью товара */
const events = new EventEmitter();
const basketModel = new Basket(events);
const productsModel = new Catalog(events);
const buyerModel = new Buyer(events);
const gallery = ensureElement<HTMLElement>('.gallery');
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'));
const header = new Header(events, ensureElement<HTMLElement>('.header'));
const basketView = new BasketView(events, cloneTemplate('#basket'));
const orderView = new Order(events, cloneTemplate<HTMLFormElement>('#order'));
const contactsView = new Contacts(events, cloneTemplate<HTMLFormElement>('#contacts'));
const successView = new Success(events, cloneTemplate('#success'));
const preview = new ProductPreview(cloneTemplate('#card-preview'), () => {
    events.emit('card:basket');
});

const getBasketButtonText = (product: IProduct): string => {
    if (product.price === null) {
        return 'Недоступно';
    }
    return basketModel.hasItem(product.id) ? 'Удалить из корзины' : 'В корзину';
};

const updateBasket = (): void => {
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

    basketView.items = items;
    basketView.total = basketModel.getTotal();
    header.counter = basketModel.getCount();
};

events.on('basket:change', updateBasket);
updateBasket();

const openPreview = (product: IProduct) => {
    productsModel.setPreview(product);
};

events.on('preview:change', () => {
    const product = productsModel.getPreview();
    if (!product) {
        return;
    }

    modal.content = preview.render({
        title: product.title,
        image: `${CDN_URL}${product.image}`,
        category: product.category as CategoryKey,
        description: product.description,
        price: product.price,
        button: getBasketButtonText(product),
    });
    modal.open();
});

events.on('basket:open', () => {
    modal.content = basketView.render();
    modal.open();
});

events.on<{ id: string }>('basket:remove', ({ id }) => {
    const product = basketModel.getItems().find((item) => item.id === id);
    if (!product) {
        return;
    }

    basketModel.removeItem(product);
});

events.on('card:basket', () => {
    const product = productsModel.getPreview();
    if (!product || product.price === null) {
        return;
    }

    if (basketModel.hasItem(product.id)) {
        basketModel.removeItem(product);
    } else {
        basketModel.addItem(product);
    }

    events.emit('preview:change');
});

events.on('catalog:change', () => {
    const cards = productsModel.getItems().map((product) => {
        const component = new ProductCard(cloneTemplate('#card-catalog'), () => openPreview(product));
        return component.render({
            title: product.title,
            image: `${CDN_URL}${product.image}`,
            category: product.category as CategoryKey,
            price: product.price,
        });
    });

    gallery.replaceChildren(...cards);
});

productsModel.setItems(apiProducts.items as IProduct[]);

communication.getProducts()
    .then((data) => productsModel.setItems(data.items))
    .catch((error: unknown) => {
        console.error(error);
    });

/** Оформление заказа */
const stepMessages = (...fields: (keyof IBuyer)[]): string[] => {
    const errors = buyerModel.validate();
    return fields
        .map((field) => errors[field])
        .filter((message): message is string => Boolean(message));
};

const updateBuyerForms = (): void => {
    const data = buyerModel.getData();
    const orderMessages = stepMessages('payment', 'address');
    const orderStarted = Boolean(data.payment || data.address.trim());
    orderView.render({
        payment: data.payment,
        address: data.address,
        valid: orderMessages.length === 0,
        errors: orderStarted ? (orderMessages[0] ?? '') : '',
    });

    const contactMessages = stepMessages('email', 'phone');
    const contactsStarted = Boolean(data.email.trim() || data.phone.trim());
    contactsView.render({
        email: data.email,
        phone: data.phone,
        valid: contactMessages.length === 0,
        errors: contactsStarted ? (contactMessages[0] ?? '') : '',
    });
};

events.on('buyer:change', updateBuyerForms);

events.on('basket:order', () => {
    modal.content = orderView.render();
    modal.open();
});

events.on<{ value: string }>('order.payment:change', ({ value }) => {
    buyerModel.setData({ payment: value as TPayment });
});

events.on<{ value: string }>('order.address:change', ({ value }) => {
    buyerModel.setData({ address: value });
});

events.on('order:submit', () => {
    modal.content = contactsView.render();
});

events.on<{ value: string }>('contacts.email:change', ({ value }) => {
    buyerModel.setData({ email: value });
});

events.on<{ value: string }>('contacts.phone:change', ({ value }) => {
    buyerModel.setData({ phone: value });
});

events.on('contacts:submit', () => {
    const data = buyerModel.getData();
    contactsView.valid = false;

    communication
        .postOrder({
            payment: data.payment as TPayment,
            email: data.email.trim(),
            phone: data.phone.trim(),
            address: data.address.trim(),
            total: basketModel.getTotal(),
            items: basketModel.getItems().map((item) => item.id),
        })
        .then((result) => {
            basketModel.clear();
            buyerModel.clear();
            modal.content = successView.render({ total: result.total });
        })
        .catch((error: unknown) => {
            updateBuyerForms();
            contactsView.errors = typeof error === 'string' ? error : 'Не удалось оформить заказ';
        });
});

events.on('success:close', () => {
    modal.close();
});
