package main

import (
	"errors"
	"fmt"
	"io/fs"
	"io/ioutil"
	"sort"
	"sync"
)

// Тип данных для параметра сортировки, может принимать только значения asc и desc
type SortOrder string

const (
	ASC  SortOrder = "asc"
	DESC SortOrder = "desc"
)

// Тип данных для типа файла, может принимать только значения f и d
type FileType string

const (
	FILE = "f"
	DIR  = "d"
)

// FileSystem() принимает путь к директории и порядок сортировки в качестве параметров.
// Возвращает срез структур FileInfo, отсортированный по полю BaseSize в порядке,
// заданном sortOrder
func FileSystem(root string, sortOrder SortOrder) ([]FileInfo, error) {
	if sortOrder != ASC && sortOrder != DESC {
		errText := fmt.Sprintf("%s is invalid value for sort parameter.\n", sortOrder)
		return nil, errors.New(errText)
	}
	// С помощью filesToStructs создаем срез структур, содержащий информацию о файлах.
	fileInfos, err := filesToStructs(root)
	if err != nil {
		errText := "сouldn't create strcts slice"
		return nil, errors.New(errText)

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
	return fileInfos, nil
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
