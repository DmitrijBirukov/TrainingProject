function getJSON(root, sort_order){
    let xhr = new XMLHttpRequest();
    let host = window.location.href;
    let url = `${host}files?root=${root}&sort_order=${sort_order}`;
    console.log(url);
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onerror = function () {
        alert(`Erorr ${xhr.status} ${xhr.statusText}`)
    }
    xhr.onload = function () {
        callback(xhr);
    }
    xhr.send();
} 

function callback(xhr){
    let resp = xhr.response
    let parent = document.querySelector('#files')
    let values = ['type', 'name', 'converted_size']
    createLi(resp, parent, values)
}


function createLi(response, parent, values) {
    for (let r of response) {
        let content = '';
        let li = document.createElement('li');
        for (let v of values){
            content += `${r[v]} `;
        }
        li.innerHTML = content;
        if (r['type'] === 'd'){
            li.addEventListener('click', () => {
                previous.push(root);
                root += `${r['name']}/`;
                parent.innerHTML = '';
                getJSON(root, sort_order);
            });
        }
        parent.appendChild(li);
    }
}


let root = "/";
let sort_order = "asc";
let previous = [];


document.addEventListener('DOMContentLoaded', () => {
    getJSON(root, sort_order);

    let parent = document.querySelector('#files');
    let btn = document.querySelector('#back');
    document.getElementsByName('sortOrder').forEach((element) => {
        element.addEventListener('click', () => {
            sort_order = element.getAttribute('id');
            parent.innerHTML = '';
            getJSON(root, sort_order);
        })
    })

    btn.addEventListener('click', () => {
        if (previous.length === 0) {
            alert("You're in the root directory");
        } else {
            root = previous.pop();
            console.log(root);
            parent.innerHTML = '';
            getJSON(root, sort_order);
        }
    })
});