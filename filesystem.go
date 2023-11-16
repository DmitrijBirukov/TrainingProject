package main

import (
	"fmt"
	"io/fs"
	"io/ioutil"
	"log"
	"sort"
	"sync"
)

// Структура FileInfo хранит информацию о файле.
// В поле Type хранится тип файла: файл или директория.
// В поле Name хранится имя файла.
// В поле BaseSize хранится размер файла в байтах.
// В поле ConvertedSize хранится размер файла после перевода байт в килобайты, мегабайты и т.д.
type FileInfo struct {
	Type          string
	Name          string
	BaseSize      int64
	ConvertedSize string
}

// FileSystem() принимает путь к директории и порядок сортировки в качествер параметров.
// Возвращает срез структур FileInfo, отсортированный по полю BaseSize в порядке,
// заданном sortOrder
func FileSystem(root, sortOrder string) []FileInfo {
	if sortOrder != "asc" && sortOrder != "desc" {
		fmt.Printf("%s is invalid value for sort parameter.\n", sortOrder)
		log.Fatal()
	}
	// С помощью filesToStructs создаем срез структур, содержащий информацию о файлах.
	fileInfos, err := filesToStructs(root)
	if err != nil {
		fmt.Println("Couldn't calculate file's size")
		log.Fatal()
	}
	// В зависимости от значения флага sortOrder, сортируем срез структур по полю Size
	// в убывающем или возрастающем порядке
	if sortOrder == "asc" {
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
func fileType(file fs.FileInfo) string {
	if file.IsDir() {
		return "d"
	}
	return "f"
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
			var newFile FileInfo
			newFile.Type = fileType(f)
			newFile.Name = f.Name()
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
