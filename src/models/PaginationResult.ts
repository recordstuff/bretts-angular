export interface PaginationResult<T> {
    Page: number
    PageCount: number
    ItemCount: number
    Items: T[]
}

export const emptyPaginationResult = <T>(): PaginationResult<T> => ({
    Page: 1,
    PageCount: 0,
    ItemCount: 0,
    Items: [],
})
