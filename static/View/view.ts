import { Controller } from "../Controller/controller.js";
import { Loader } from "../loader.js";
import { FileDataResponseList, FileType, SortOrder } from "../types.js";
export class View {

    parent : Element | null;
    queryParams : {
        root : string,
        sortOrder : SortOrder
    };
    previous : string[];
    callback : Function
    controller : Controller;
    constructor(
        parent : Element | null,
        queryParams : {
            root : string,
            sortOrder : SortOrder
        }, 
        previous : string[], 
        callback : Function
    ){
        this.parent = parent;
        this.queryParams = queryParams;
        this.previous = previous;
        this.callback = callback;
        this.controller = new Controller(parent, queryParams, previous, callback);
    }
    // createList() 
    createList(response : FileDataResponseList){
        response.forEach( (r) => {
            let li = document.createElement('li');
            let content = `${r.type} ${r.name} ${r.converted_size}`;
            li.innerHTML = content;
    
            // Если файл является директорией, нужен обработчик клика мышкой
            // для перехода в выбранную директорию
            if (r.type === FileType.dir){
                li.addEventListener('click', () => {
                    this.previous.push(this.queryParams.root);
                    this.queryParams.root += `${r['name']}/`;
                    this.parent!.innerHTML = '';
                    this.controller.getFilesData();
                });
            }
            this.parent!.appendChild(li);
        })
       Loader.hide();
    }

    initialize(){
        this.controller.getFilesData();
        this.controller.initialize();
    }
}