import './scss/styles.scss';
import { apiProducts } from './utils/data'; 
import { Catalog } from './components/base/models/catalog';
import { Buyer } from './components/base/models/buyer';
import { Basket } from './components/base/models/basket';
import { IProduct } from './types';

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