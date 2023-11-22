export class Loader {
    
    // show() отображает элемент на странице
    static show(){
        let loader = document.getElementById('load');
        if (loader) {
            loader.style.display = 'block';
        }
    }

    // hide() скрывает элемент со страницы
    static hide(){
        let loader = document.getElementById('load');
        if (loader){
            loader.style.display = 'none';
        }
    }
}