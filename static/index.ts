import { Model } from "./Model/model"
import { View } from "./View/view"
import { Controller } from "./Controller/controller"
import { FileDataResponseList, SortOrder } from "./types";

// Вызов обработчика события загрузки html-страницы
document.addEventListener('DOMContentLoaded', () => {
    // Задаем начальные значения параметров 
    let queryParams = {
     root : '/',
     sortOrder : SortOrder.asc
    };

    // Задаем массив для хранения истории посещенных директорий
    let previous: string[] = [];

    // Задаем элементы страницы
    let parent = document.querySelector('#files');

    function callback(response : FileDataResponseList) {
        view.createList(response);
    }

    // Инициализируем объекты классов
    let view = new View(parent, queryParams, previous, callback);




    view.initialize();
});