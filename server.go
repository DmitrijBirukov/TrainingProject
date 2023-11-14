package main

import (
	"fmt"
	"html/template"
	"log"
	"net/http"
)

func main() {
	http.HandleFunc("/", htmlHandler)
	http.Handle("/static/", http.StripPrefix("/static", http.FileServer(http.Dir("./static/"))))
	fmt.Println("Server started at port 8081")
	if err := http.ListenAndServe(":8081", nil); err != nil {
		log.Fatal(err)
	}
}

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
