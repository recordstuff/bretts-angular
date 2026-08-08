import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { JwtRole } from '../models/Jwt'
import { LoginSession } from '../models/LoginSession'
import { PaginationResult } from '../models/PaginationResult'
import { SortDirection } from '../models/SortDirection'
import { UserCredentials } from '../models/UserCredentials'
import { UserDetail } from '../models/UserDetail'
import { UserNew } from '../models/UserNew'
import { UserSummary } from '../models/UserSummary'
import { UsersSortColumn } from '../models/UsersSortColumn'

@Injectable({ providedIn: 'root' })
export class UserClient {
    private readonly httpClient = inject(HttpClient)
    private readonly basePath = 'user'

    public login(userCredentials: UserCredentials): Observable<LoginSession> {
        return this.httpClient.post<LoginSession>(`${this.basePath}/login`, userCredentials)
    }

    public getUsers(
        page: number,
        pageSize: number,
        searchText: string | null = null,
        roleFilter: JwtRole = JwtRole.Any,
        sortColumn: UsersSortColumn = UsersSortColumn.DisplayName,
        sortDirection: SortDirection = SortDirection.Ascending,
    ): Observable<PaginationResult<UserSummary>> {
        let params = new HttpParams()
            .set('page', page)
            .set('pageSize', pageSize)
            .set('roleFilter', roleFilter)
            .set('sortColumn', sortColumn)
            .set('sortDirection', sortDirection)

        if (searchText !== null && searchText.length > 0) {
            params = params.set('searchText', searchText)
        }

        return this.httpClient.get<PaginationResult<UserSummary>>(`${this.basePath}/users`, { params })
    }

    public getUser(id: string): Observable<UserDetail> {
        return this.httpClient.get<UserDetail>(`${this.basePath}/user/${encodeURIComponent(id)}`)
    }

    public updateUser(userDetail: UserDetail): Observable<UserDetail> {
        return this.httpClient.post<UserDetail>(`${this.basePath}/update`, userDetail)
    }

    public insertUser(userNew: UserNew): Observable<UserDetail> {
        return this.httpClient.post<UserDetail>(`${this.basePath}/insert`, userNew)
    }

    public deleteUser(id: string): Observable<boolean> {
        return this.httpClient.delete<boolean>(`${this.basePath}/delete/${encodeURIComponent(id)}`)
    }
}
