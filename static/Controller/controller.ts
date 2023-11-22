import { Model } from "../Model/model";
import { SortOrder } from "../types";

export class Controller{
    
    parent: Element | null;
    queryParams : {
        root : string,
        sortOrder : SortOrder,
    };
    previous : string[];
    callback : Function;
    model : Model;

    // Конструктор класса Controller
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

    // getFilesData() получает данные от модели
    getFilesData(){
        this.model.getFilesData(this.queryParams, this.callback)
    }

    // initialize() вызывает обработчики событий для элементов на html-странице
    initialize(){

        let sortButtons = document.getElementsByName('sortOrder');
        let backButton = document.querySelector('#back');
        
        // Вызов обработчиков клика мышкой для кнопок сортировки
        sortButtons.forEach( (element) => {
            element.addEventListener('click', () => {
                this.queryParams.sortOrder = element.getAttribute('id')! as SortOrder;
                this.parent!.innerHTML = '';
                this.model.getFilesData(this.queryParams, this.callback);
            })
        });

        // Вызов обработчика клика мышкой для кнопки перехода в прошлую директорию
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