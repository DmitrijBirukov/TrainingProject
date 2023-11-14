package main

import (
	"flag"
	"fmt"
	"io/fs"
	"io/ioutil"
	"os"
	"sort"
	"sync"
)

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

// fileType() принимает файл или директорию и возвращает
// строку "f" или "d" соответственно
func fileType(file fs.FileInfo) string {
	if file.IsDir() {
		return "d"
	}
	return "f"
}

// mapFileSize() принимает путь к директории
// для каждого файла внутри директории создается горутина, в которой
// вычисляется размер файла и записывается в map.
// Ключом является тип и имя файла, а значениемя размер файла
func mapFileSize(path string) (map[string]int64, error) {
	innerFiles, err := ioutil.ReadDir(path)
	m := make(map[string]int64)
	if err != nil {
		return nil, err
	}
	var wg sync.WaitGroup
	for _, file := range innerFiles {
		wg.Add(1)
		go func(f fs.FileInfo) error {
			defer wg.Done()
			fileTypeName := fmt.Sprintf("%s %s", fileType(f), f.Name())
			if f.IsDir() {
				m[fileTypeName], err = dirSize(fmt.Sprintf("%s/%s", path, f.Name()))
			} else {
				m[fileTypeName] = f.Size()
			}
			return err
		}(file)
	}
	wg.Wait()
	return m, err
}

// byteConvert() принимает размер файла в байтах
// и если требуется преобразует в килобайты, мегабайты и т.д.
func byteConvert(bytes int64) (int64, string) {
	sizes := [5]string{"b", "Kb", "Mb", "Gb", "Tb"}
	i := 0
	for bytes >= 1024 && i < 4 {
		bytes /= 1024
		i++
	}
	return bytes, sizes[i]
}

// В main() задаются флаги root и sort
// root хранит путь до корневой директивы
// sort хранит порядок сортировки - по возрастанию или по убыванию
func fileSystem() {
	root := flag.String("root", "/home", "Path to directory")
	sortOrder := flag.String("sort", "asc", "Sorting order. Can be ascending or descending")
	flag.Parse()
	if *sortOrder != "asc" && *sortOrder != "desc" {
		fmt.Printf("%s is invalid value for sort parameter.\n", *sortOrder)
		os.Exit(10)
	}
	// С помощью mapFileSize создаем map названий и размеров файлов
	fileSizes, err := mapFileSize(*root)
	if err != nil {
		fmt.Println("")
	}
	// Создаем срез ключей
	var keys []string
	for key := range fileSizes {
		keys = append(keys, key)
	}
	// Сортируем ключи в зависимости от флага root
	sort.Slice(keys, func(i, j int) bool {
		if *sortOrder == "asc" {
			return fileSizes[keys[i]] < fileSizes[keys[j]]
		}
		return fileSizes[keys[i]] > fileSizes[keys[j]]
	})

	// Вывод по шаблону <тип файла> <имя файла> <размер>
	for _, key := range keys {
		size, units := byteConvert(fileSizes[key])
		fmt.Printf("%s %d %s\n", key, size, units)
	}
}
