import { Model } from "./Model/model"
import { View } from "./View/view"
import { Controller } from "./Controller/controller"

function callback(response : any) {
    view.createList(response, parent, root, sortOrder, previous, model, callback);
}

// Задаем начальные значения параметров 
let root = '/';
let sortOrder = 'asc';

// Задаем массив для хранения истории посещенных директорий
let previous : string[] = [];

// Задаем элементы страницы
let parent = document.querySelector('#files');
let sortButtons = document.getElementsByName('sortOrder');
let backButton = document.querySelector('#back');

// Инициализируем объекты классов
let model = new Model();
let view = new View();
let controller = new Controller(sortButtons, parent, backButton);


// Вызов обработчика события загрузки html-страницы
document.addEventListener('DOMContentLoaded', () => {
    view.initialize(root, sortOrder, callback, model);
    controller.initialize(root, sortOrder, previous, model, callback);
});