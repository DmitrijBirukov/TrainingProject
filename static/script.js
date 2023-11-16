function getJSON(root, sort_order){
    let xhr = XMLHttpRequest();
    let host = window.location.host;
    let url = `${host}files?root=${root}&sortOrder=${sort_order}`;
    xhr.open('GET', url)
    xhr.onerror = function () {
        alert(`${xhr.status}: ${xhr.statusText}`);
    }
    xhr.send();
} 

let root = '/';
let sort_order = 'asc';

document.addEventListener('DOMContentLoaded', function () {
    getJSON(root, sort_order)
})