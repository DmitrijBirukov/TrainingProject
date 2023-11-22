import { Model } from "../Model/model.js";
import { SortOrder } from "../types.js";

export class Controller{
    
    parent: Element | null;
    queryParams : {
        root : string,
        sortOrder : SortOrder,
    };
    previous : string[];
    callback : Function;
    model : Model;

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
        this.model = new Model();
    }

    getFilesData(){
        this.model.getFilesData(this.queryParams, this.callback)
    }

    initialize(){
        let sortButtons = document.getElementsByName('sortOrder');
        let backButton = document.querySelector('#back');
        sortButtons.forEach( (element) => {
            element.addEventListener('click', () => {
                this.queryParams.sortOrder = element.getAttribute('id')! as SortOrder;
                this.parent!.innerHTML = '';
                this.model.getFilesData(this.queryParams, this.callback);
            })
        });

        // Вызов обработчика клика мышкой для перехода в прошлую директорию
        backButton!.addEventListener('click', () => {
            if (this.previous.length === 0) {
                alert("You're in the root directory");
            } else {
                this.queryParams.root = this.previous.pop()!;
                this.parent!.innerHTML = '';
                this.model.getFilesData(this.queryParams, this.callback);
            }
        });
    }
}