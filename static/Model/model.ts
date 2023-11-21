import { FileDataResponseList, SortOrder } from "../types";

export class Model {
    getFiles(
        queryParams : {
            root : string,
            sortOrder : SortOrder
        },
        callback : Function,
    ){
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
export default Model;