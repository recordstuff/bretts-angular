import { HttpClient, HttpParams } from '@angular/common/http'
import { inject } from '@angular/core'
import { Observable } from 'rxjs'

export abstract class ClientBase {
    private readonly httpClient = inject(HttpClient)

    protected constructor(private readonly basePath: string) {}

    protected get<T>(path: string, params?: HttpParams): Observable<T> {
        if (params === undefined) {
            return this.httpClient.get<T>(this.url(path))
        }

        return this.httpClient.get<T>(this.url(path), {params})
    }

    protected post<TResponse, TRequest>(path: string, request: TRequest): Observable<TResponse> {
        return this.httpClient.post<TResponse>(this.url(path), request)
    }

    protected delete<T>(path: string): Observable<T> {
        return this.httpClient.delete<T>(this.url(path))
    }

    protected pathWithId(path: string, id: string): string {
        return `${path}/${encodeURIComponent(id)}`
    }

    protected paginationParams(
        page: number,
        pageSize: number,
        searchText: string | null,
        sortColumn: number,
        sortDirection: number,
    ): HttpParams {
        let params = new HttpParams()
            .set('page', page)
            .set('pageSize', pageSize)
            .set('sortColumn', sortColumn)
            .set('sortDirection', sortDirection)

        if (searchText !== null && searchText.length > 0) {
            params = params.set('searchText', searchText)
        }

        return params
    }

    private url(path: string): string {
        return `${this.basePath}/${path}`
    }
}
