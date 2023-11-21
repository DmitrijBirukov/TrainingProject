import { Model } from "../Model/model"
import { FileDataResponseList, FileType, SortOrder } from "../types.js";

export class View {
    // createList() 
    createList(
        response : FileDataResponseList,
        parent : Element | null, 
        queryParams : {
            root : string,
            sortOrder : SortOrder
        },
        previous : string[],
        model : Model,
        callback : Function
    ){
        response.forEach( (r) => {
            let li = document.createElement('li');
            let content = `${r.type} ${r.name} ${r.converted_size}`;
            li.innerHTML = content;
    
            // Если файл является директорией, нужен обработчик клика мышкой
            // для перехода в выбранную директорию
            if (r['type'] === FileType.dir){
                li.addEventListener('click', () => {
                    previous.push(queryParams.root);
                    queryParams.root += `${r['name']}/`;
                    parent!.innerHTML = '';
                    model.getFiles(queryParams, callback);
                });
            }
            parent!.appendChild(li);
        })
    }

    initialize(
        queryParams : {
            root : string,
            sortOrder : SortOrder
        },
        callback : Function,
        model : Model
    ){
        model.getFiles(queryParams, callback);
    }
}