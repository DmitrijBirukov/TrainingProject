export class Model {
    getFiles(
        root : string,
        sortOrder : string,
        callback : Function,
    ){
        let xhr = new XMLHttpRequest();
        let host = window.location.href;
        let url = `${host}files?root=${root}&sort_order=${sortOrder}`;
        xhr.open('GET', url);
        xhr.responseType = 'json';
        xhr.onerror = function () {
            alert(`Erorr ${xhr.status} ${xhr.statusText}`);
        }
        xhr.onload = function () {
            if (xhr.status === 200){
                callback(xhr.response);
            }  
        }
        xhr.send();
    }
}
export default Model;