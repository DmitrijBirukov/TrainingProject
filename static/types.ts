// Определение типа для порядка сортировки
export enum SortOrder {
    asc = 'asc',
    desc = 'desc'
}

// Определение типа для типа файла
export enum FileType {
    file = 'f',
    dir = 'd'
}

// Определение типа, хранящего информацию о файле
export type File = {
    type : FileType,
    name : string,
    converted_size : string
}

// Определене типа для массива содержащего элементы типа File
export type FileDataResponseList = File[]