export class Loader {
    
    static show(){
        let loader = document.getElementById('load');
        if (loader) {
            loader.style.display = 'block';
            console.log('show');
        }
    }

    static hide(){
        let loader = document.getElementById('load');
        if (loader){
            loader.style.display = 'none';
            console.log('hide');
        }
    }
}