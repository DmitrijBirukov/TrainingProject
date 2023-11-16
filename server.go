package main

import (
	"encoding/json"
	"fmt"
	"html/template"
	"log"
	"net/http"
	//"encoding/json"
)

type Response struct {
	Status    int64
	ErrorText string
	Data      interface{}
}

func main() {
	port := 8081
	http.HandleFunc("/", htmlHandler)
	http.HandleFunc("/files", jsonHandler)
	http.Handle("/static/", http.StripPrefix("/static", http.FileServer(http.Dir("./static/"))))
	fmt.Printf("Server started at port %d\n", port)
	if err := http.ListenAndServe(fmt.Sprintf(":%d", port), nil); err != nil {
		log.Fatal(err)
	}
}

// htmlHandler() - обработчик запросов, отвечающий за отображение html-страницы
func htmlHandler(w http.ResponseWriter, r *http.Request) {
	tmpl, err := template.ParseFiles("static/index.html")
	if err != nil {
		fmt.Println("Couldn't parse file")
		return
	}
	err = tmpl.Execute(w, nil)
	if err != nil {
		fmt.Println("Couldn't generate html markup")
		return
	}
}

// jsonHandler() - обработчик запросов, отвечающий за вывод jsonов
// по маршруту /files, содержащих информацию о файлах в директори
func jsonHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	root := r.URL.Query().Get("root")
	sortOrder := SortOrder(r.URL.Query().Get("sort_order"))
	files := FileSystem(root, sortOrder)
	jsonData, err := json.Marshal(files)
	if err != nil {
		fmt.Println("Couldn't marshal files")
		return
	}

	_, err = w.Write(jsonData)
	if err != nil {
		fmt.Println("Couldn't write json data")
		return
	}
}
