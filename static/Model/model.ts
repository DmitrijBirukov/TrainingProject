import { Loader } from "../loader";
import { FileDataResponseList, SortOrder } from "../types";

export class Model {

    // getFilesData() делает xmlhttp-запрос для получения информации о файлах в директории.
    // Если получен ответ с кодом 200, вызывает callback
    getFilesData(
        queryParams : {
            root : string,
            sortOrder : SortOrder
        },
        callback : Function,
    ){
        // Пока не сформироано содержимое списка на странице отображаем загрузчик
        Loader.show();
        let xhr = new XMLHttpRequest();
        let host = window.location.href;
        let url = `${host}files?root=${queryParams.root}&sort_order=${queryParams.sortOrder}`;
        xhr.open('GET', url);
        xhr.responseType = 'json';
        xhr.onerror = function () {
            alert(`Erorr ${xhr.status} ${xhr.statusText}`);
        }
        xhr.onload = function () {
            if (xhr.status === 200){
                callback(xhr.response as FileDataResponseList);
            }  
        }
        xhr.send();
    }
}