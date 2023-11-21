export enum SortOrder {
    asc = 'asc',
    desc = 'desc'
}

export enum FileType {
    file = 'f',
    dir = 'd'
}

export type File = {
    type : FileType,
    name : string,
    converted_size : string
}

export type FileDataResponseList = File[]