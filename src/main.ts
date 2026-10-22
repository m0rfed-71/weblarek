import './scss/styles.scss';
import { apiProducts } from './utils/data';
import { Catalog } from './components/models/catalog';
import { Buyer } from './components/models/buyer';
import { Basket } from './components/models/basket';
import { IProduct } from './types';
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
