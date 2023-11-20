import { Model } from "../Model/model"

export class View {

    // createList() 
    createList(
        response : any,
        parent : Element | null, 
        root : string,
        sortOrder : string,
        previous : string[],
        model : Model,
        callback : Function
    ){
        response.forEach( (r : any) => {
            let content = '';
            let li = document.createElement('li');
            content = `${r['type']} ${r['name']} ${r['converted_size']}`;
            li.innerHTML = content;
    
            // Если файл является директорией, нужен обработчик клика мышкой
            // для перехода в выбранную директорию
            if (r['type'] === 'd'){
                li.addEventListener('click', () => {
                    previous.push(root);
                    root += `${r['name']}/`;
                    parent!.innerHTML = '';
                    model.getFiles(root, sortOrder, callback);
                });
            }
            parent!.appendChild(li);
        })
    }

    initialize(
        root : string,
        sortOrder : string,
        callback : Function,
        model : Model
    ){
        model.getFiles(root, sortOrder, callback);
    }
}