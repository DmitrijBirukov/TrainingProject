import { Model } from "./Model/model.js"
import { View } from "./View/view.js"
import { Controller } from "./Controller/controller.js"
import { FileDataResponseList, SortOrder } from "./types.js";

// Вызов обработчика события загрузки html-страницы
document.addEventListener('DOMContentLoaded', () => {
    // Задаем начальные значения параметров 
    let queryParams = {
     root : '/',
     sortOrder : SortOrder.asc
    };
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


    function callback(response : FileDataResponseList) {
        view.createList(response, parent, queryParams, previous, model, callback);
    }
    view.initialize(queryParams, callback, model);
    controller.initialize(queryParams, previous, model, callback);
});