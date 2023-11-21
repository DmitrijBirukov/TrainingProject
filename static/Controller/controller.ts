import { Model } from "../Model/model.js";
import { SortOrder } from "../types.js";

export class Controller{
    
    sortButtons;
    parent;
    backButton;

    constructor(
        sortButtons : NodeListOf<HTMLElement>,
        parent : Element | null,
        backButton : Element | null
    ){
        this.sortButtons = sortButtons;
        this.parent = parent;
        this.backButton = backButton;
    }
    initialize(
        queryParams : {
            root : string,
            sortOrder : SortOrder
        },
        previous : string[],
        model : Model,
        callback : Function
    ){

        this.sortButtons.forEach( (element) => {
            element.addEventListener('click', () => {
                queryParams.sortOrder = element.getAttribute('id')! as SortOrder;
                this.parent!.innerHTML = '';
                model.getFiles(queryParams, callback);
            })
        });

        // Вызов обработчика клика мышкой для перехода в прошлую директорию
        this.backButton!.addEventListener('click', () => {
            if (previous.length === 0) {
                alert("You're in the root directory");
            } else {
                queryParams.root = previous.pop()!;
                this.parent!.innerHTML = '';
                model.getFiles(queryParams, callback);
            }
        });
    }
}