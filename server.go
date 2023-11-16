package main

import (
	"encoding/json"
	"fmt"
	"html/template"
	"log"
	"net/http"
	//"encoding/json"
)

func main() {

	http.HandleFunc("/", htmlHandler)
	http.HandleFunc("/files", jsonHandler)
	http.Handle("/static/", http.StripPrefix("/static", http.FileServer(http.Dir("./static/"))))
	fmt.Println("Server started at port 8081")
	if err := http.ListenAndServe(":8081", nil); err != nil {
		log.Fatal(err)
	}
}

// htmlHandler() - обработчик запросов, отвечающий за отображение html-страницы
func htmlHandler(w http.ResponseWriter, r *http.Request) {
	tmpl, err := template.ParseFiles("static/index.html")
	if err != nil {
		fmt.Println("Couldn't parse file")
		log.Fatal(err)
	}
	err = tmpl.Execute(w, nil)
	if err != nil {
		fmt.Println("Couldn't generate html markup")
		log.Fatal(err)
	}
}

// jsonHandler() - обработчик запросов, отвечающий за вывод jsonов
// по маршруту /files, содержащих информацию о файлах в директори
func jsonHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	root := r.URL.Query().Get("root")
	sortOrder := r.URL.Query().Get("sortOrder")
	files := FileSystem(root, sortOrder)
	jsonData, err := json.Marshal(files)
	if err != nil {
		fmt.Println("Couldn't marshal files")
		log.Fatal(err)
	}

	_, err = w.Write(jsonData)
	if err != nil {
		fmt.Println("Couldn't write json data")
	}

}
