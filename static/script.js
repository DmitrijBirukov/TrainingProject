// getJSON() принимает в качестве параметров путь к директори и порядок сортировки. 
// Посылает get-запрос, чтобы получить данные о файлах в директории в виде jsonов.
function getJSON(root, sort_order){
    let xhr = new XMLHttpRequest();
    let host = window.location.href;
    let url = `${host}files?root=${root}&sort_order=${sort_order}`;
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onerror = function () {
        alert(`Erorr ${xhr.status} ${xhr.statusText}`)
    }
    xhr.onload = function () {
        if (xhr.status === 200){
            callback(xhr);
        }  
    }
    xhr.send();
} 

// callback() принимает в качестве параметра XMLHTTPRequest 
// После ответа от сервера вызывает createLi 
function callback(xhr){
    let resp = xhr.response
    let parent = document.querySelector('#files')
    let values = ['type', 'name', 'converted_size']
    createLi(resp, parent, values)
}


// createLi() принимает в качестве параметров массив объектов, 
// родительский html элемент и массив с полями объекта.
// Для каждого объекта в родительском элементе создается элемент <li>
// после чего в него добавляется содержмое заданных полей объекта.
function createLi(response, parent, values) {
    for (let r of response) {
        let content = '';
        let li = document.createElement('li');
        for (let v of values){
            content += `${r[v]} `;
        }
        li.innerHTML = content;

        // Если файл является директорией, нужен обработчик клика мышкой
        // для перехода в выбранную директорию
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

// Переменные для значений root и sort_order по умолчанию
let root = "/";
let sort_order = "asc";

// Переменная для хранения истории посещенных директорий
let previous = [];

// Вызов обработчика события загрузки html-страницы
document.addEventListener('DOMContentLoaded', () => {
   
    getJSON(root, sort_order);

    let parent = document.querySelector('#files');
    let btn = document.querySelector('#back');
   
    // Вызовы обработчиков клика мышкой для изменения параметров сортировки
    document.getElementsByName('sortOrder').forEach((element) => {
        element.addEventListener('click', () => {
            sort_order = element.getAttribute('id');
            parent.innerHTML = '';
            getJSON(root, sort_order);
        })
    })

    // Вызов обработчика клика мышкой для перехода в прошлую директорию
    btn.addEventListener('click', () => {
        if (previous.length === 0) {
            alert("You're in the root directory");
        } else {
            root = previous.pop();
            parent.innerHTML = '';

            getJSON(root, sort_order);
        }
    })
});