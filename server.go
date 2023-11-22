package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"html/template"
	"log"
	"net/http"
)

// В main() задаются маршруты на сайте и запускается сервер
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
	tmpl, err := template.ParseFiles("static/dist/index.html")
	if err != nil {
		log.Println("Couldn't parse file")
		w.Write([]byte("Couldn't parse file"))
		return
	}
	err = tmpl.Execute(w, nil)
	if err != nil {
		log.Println("Couldn't generate html markup")
		w.Write([]byte("Couldn't generate html markup"))
		return
	}
}

func postStatistics(ts TimeStat) error {
	statData, err := json.Marshal(ts)
	url := "http://localhost:80/set_stat.php"

	if err != nil {
		log.Println("Couldn't marshall statistics info")
		return err
	}

	request, err := http.NewRequest("POST", url, bytes.NewBuffer(statData))
	if err != nil {
		log.Println("Couldn't configure POST request")
		return err
	}

	client := &http.Client{}
	_, err = client.Do(request)
	if err != nil {
		log.Printf("Couldn't send POST request to %s", url)
		return err
	}
	return nil
}

// jsonHandler() - обработчик запросов, отвечающий за вывод jsonов
// по маршруту /files, содержащих информацию о файлах в директори
func jsonHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	root := r.URL.Query().Get("root")
	sortOrder := SortOrder(r.URL.Query().Get("sort_order"))
	files, err := FileSystem(root, sortOrder)

	if err != nil {
		log.Println(err)
	}

	jsonData, err := json.Marshal(files)
	if err != nil {
		log.Println("Couldn't marshal files")
		w.Write([]byte("Couldn't marshall files"))
		return
	}

	_, err = w.Write(jsonData)
	if err != nil {
		log.Println("Couldn't write json data")
		w.Write([]byte("Couldn't write json data"))
		return
	}
}
