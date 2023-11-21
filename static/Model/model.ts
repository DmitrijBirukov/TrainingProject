import { Loader } from "../loader.js";
import { FileDataResponseList, SortOrder } from "../types.js";

export class Model {
    getFiles(
        queryParams : {
            root : string,
            sortOrder : SortOrder
        },
        callback : Function,
    ){
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