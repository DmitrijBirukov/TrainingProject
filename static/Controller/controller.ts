import { Model } from "../Model/model";

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
        root : string,
        sortOrder: string,
        previous : string[],
        model : Model,
        callback : Function
    ){

        this.sortButtons.forEach( (element) => {
            element.addEventListener('click', () => {
                sortOrder = element.getAttribute('id')!;
                this.parent!.innerHTML = '';
                model.getFiles(root, sortOrder, callback);
            })
        });

        // Вызов обработчика клика мышкой для перехода в прошлую директорию
        this.backButton!.addEventListener('click', () => {
            if (previous.length === 0) {
                alert("You're in the root directory");
            } else {
                root = previous.pop()!;
                this.parent!.innerHTML = '';
                model.getFiles(root, sortOrder, callback);
            }
        });
    }
}