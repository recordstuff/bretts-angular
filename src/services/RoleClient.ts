import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { NameGuidPair } from '../models/NameGuidPair'
import { PaginationResult } from '../models/PaginationResult'
import { RoleNew } from '../models/RoleNew'
import { RolesSortColumn } from '../models/RolesSortColumn'
import { SortDirection } from '../models/SortDirection'

@Injectable({ providedIn: 'root' })
export class RoleClient {
    private readonly httpClient = inject(HttpClient)
    private readonly basePath = 'role'

    public getAllRoles(): Observable<NameGuidPair[]> {
        return this.httpClient.get<NameGuidPair[]>(`${this.basePath}/allroles`)
    }

    public getRoles(
        page: number,
        pageSize: number,
        searchText: string | null = null,
        sortColumn: RolesSortColumn = RolesSortColumn.Name,
        sortDirection: SortDirection = SortDirection.Ascending,
    ): Observable<PaginationResult<NameGuidPair>> {
        let params = new HttpParams()
            .set('page', page)
            .set('pageSize', pageSize)
            .set('sortColumn', sortColumn)
            .set('sortDirection', sortDirection)

        if (searchText !== null && searchText.length > 0) {
            params = params.set('searchText', searchText)
        }

        return this.httpClient.get<PaginationResult<NameGuidPair>>(`${this.basePath}/roles`, {params})
    }

    public getRole(id: string): Observable<NameGuidPair> {
        return this.httpClient.get<NameGuidPair>(`${this.basePath}/role/${encodeURIComponent(id)}`)
    }

    public updateRole(role: NameGuidPair): Observable<NameGuidPair> {
        return this.httpClient.post<NameGuidPair>(`${this.basePath}/update`, role)
    }

    public insertRole(role: RoleNew): Observable<NameGuidPair> {
        return this.httpClient.post<NameGuidPair>(`${this.basePath}/insert`, role)
    }

    public deleteRole(id: string): Observable<boolean> {
        return this.httpClient.delete<boolean>(`${this.basePath}/delete/${encodeURIComponent(id)}`)
    }
}
