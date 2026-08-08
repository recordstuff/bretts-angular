export interface PaginationResult<T> {
    Page: number
    PageCount: number
    ItemCount: number
    Items: T[]
}
