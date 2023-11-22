package main

import (
	"time"
)

// Структура FileInfo хранит информацию о файле.
// В поле Type хранится тип файла: файл или директория.
// В поле Name хранится имя файла.
// В поле BaseSize хранится размер файла в байтах.
// В поле ConvertedSize хранится размер файла после перевода байт в килобайты, мегабайты и т.д.
type FileInfo struct {
	Type          FileType `json:"type"`
	Name          string   `json:"name"`
	BaseSize      int64    `json:"base_size"`
	ConvertedSize string   `json:"converted_size"`
}

type TimeStat struct {
	Root        string    `json:"root"`
	Size        string    `json:"size"`
	ElapsedTime string    `json:"elapsed_time"`
	RequestDate time.Time `json:"request_date"`
}

type Response struct {
	Status    int64       `json:"status"`
	ErrorText string      `json:"error_text"`
	Data      interface{} `json:"data"`
}
