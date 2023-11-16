package main

import (
	"fmt"
	"io/fs"
	"io/ioutil"
	"sort"
	"sync"
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

type SortOrder string

const (
	ASC  SortOrder = "asc"
	DESC SortOrder = "desc"
)

type FileType string

const (
	FILE = "f"
	DIR  = "d"
)

// FileSystem() принимает путь к директории и порядок сортировки в качестве параметров.
// Возвращает срез структур FileInfo, отсортированный по полю BaseSize в порядке,
// заданном sortOrder
func FileSystem(root string, sortOrder SortOrder) []FileInfo {
	if sortOrder != ASC && sortOrder != DESC {
		fmt.Printf("%s is invalid value for sort parameter.\n", sortOrder)

	}
	// С помощью filesToStructs создаем срез структур, содержащий информацию о файлах.
	fileInfos, err := filesToStructs(root)
	if err != nil {
		fmt.Println("Couldn't calculate file's size")

	}
	// В зависимости от значения флага sortOrder, сортируем срез структур по полю Size
	// в убывающем или возрастающем порядке
	if sortOrder == ASC {
		sort.Slice(fileInfos, func(i, j int) bool {
			return fileInfos[i].BaseSize < fileInfos[j].BaseSize
		})
	} else {
		sort.Slice(fileInfos, func(i, j int) bool {
			return fileInfos[i].BaseSize > fileInfos[j].BaseSize
		})
	}
	return fileInfos
}

// byteConvert() принимает размер файла в байтах
// и если требуется преобразует в килобайты, мегабайты и т.д.
func byteConvert(bytes int64) string {
	sizes := [5]string{"b", "Kb", "Mb", "Gb", "Tb"}
	i := 0
	for bytes >= 1024 && i < 4 {
		bytes /= 1024
		i++
	}
	return fmt.Sprintf("%d%s", bytes, sizes[i])
}

// fileType() принимает файл или директорию и возвращает
// строку "f" или "d" соответственно
func fileType(file fs.FileInfo) FileType {
	if file.IsDir() {
		return DIR
	}
	return FILE
}

// dirSize() принимает путь к директории и возвращает ее размер
func dirSize(path string) (int64, error) {
	var totalSize int64 = 0
	innerFiles, err := ioutil.ReadDir(path)
	if err != nil {
		return totalSize, err
	}
	for _, file := range innerFiles {
		if file.IsDir() {
			fileSize, err := dirSize(fmt.Sprintf("%s/%s", path, file.Name()))
			if err != nil {
				return totalSize, err
			}
			totalSize += fileSize
		} else {
			totalSize += file.Size()
		}
	}
	return totalSize, err
}

// filesToStructs() принимает путь к директории.
// Для каждого файла внутри директории создается горутина, в которой
// определяется тип файла, имя, вычисляется размер файла в байтах и размер после конвертации байтов.
// Затем полученные данные записываются в структуру FileInfo
// В результате возвращается список таких структур и ошибка.
func filesToStructs(path string) ([]FileInfo, error) {
	innerFiles, err := ioutil.ReadDir(path)
	if err != nil {
		return nil, err
	}
	var fileInfos []FileInfo
	var wg sync.WaitGroup
	for _, file := range innerFiles {
		wg.Add(1)
		go func(f fs.FileInfo) error {
			defer wg.Done()
			newFile := FileInfo{fileType(f), f.Name(), 0, ""}
			if f.IsDir() {
				size, err := dirSize(fmt.Sprintf("%s/%s", path, f.Name()))
				if err != nil {
					return err
				}
				newFile.BaseSize = size
			} else {
				newFile.BaseSize = f.Size()
			}
			newFile.ConvertedSize = byteConvert(newFile.BaseSize)
			fileInfos = append(fileInfos, newFile)
			return err
		}(file)
	}
	wg.Wait()
	return fileInfos, err
}
