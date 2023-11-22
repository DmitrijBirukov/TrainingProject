import { View } from "./View/view"
import { FileDataResponseList, SortOrder } from "./types";

// Вызов обработчика события загрузки html-страницы
document.addEventListener('DOMContentLoaded', () => {
    
    // Задаем начальные значения параметров 
    let queryParams = {
     root : '/',
     sortOrder : SortOrder.asc
    };

    // Задаем массив для хранения истории посещенных директорий
    let previous : string[] = [];

    let parent = document.querySelector('#files');

    function callback(response : FileDataResponseList) {
        view.createList(response);
    }

    // Инициализируем объект view
    let view = new View(parent, queryParams, previous, callback);
    view.initialize();
});