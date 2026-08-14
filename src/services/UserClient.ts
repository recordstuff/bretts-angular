import { Injectable } from '@angular/core'
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
import { ClientBase } from './ClientBase'

@Injectable({ providedIn: 'root' })
export class UserClient extends ClientBase {
    constructor() {
        super('user')
    }

    public login(userCredentials: UserCredentials): Observable<LoginSession> {
        return this.post<LoginSession, UserCredentials>('login', userCredentials)
    }

    public getUsers(
        page: number,
        pageSize: number,
        searchText: string | null = null,
        roleFilter: JwtRole = JwtRole.Any,
        sortColumn: UsersSortColumn = UsersSortColumn.DisplayName,
        sortDirection: SortDirection = SortDirection.Ascending,
    ): Observable<PaginationResult<UserSummary>> {
        let params = this.paginationParams(page, pageSize, searchText, sortColumn, sortDirection)
        params = params.set('roleFilter', roleFilter)

        return this.get<PaginationResult<UserSummary>>('users', params)
    }

    public getUser(id: string): Observable<UserDetail> {
        return this.get<UserDetail>(this.pathWithId('user', id))
    }

    public updateUser(userDetail: UserDetail): Observable<UserDetail> {
        return this.post<UserDetail, UserDetail>('update', userDetail)
    }

    public insertUser(userNew: UserNew): Observable<UserDetail> {
        return this.post<UserDetail, UserNew>('insert', userNew)
    }

    public deleteUser(id: string): Observable<boolean> {
        return this.delete<boolean>(this.pathWithId('delete', id))
    }
}
