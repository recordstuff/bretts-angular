import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { NameGuidPair } from '../models/NameGuidPair'
import { PaginationResult } from '../models/PaginationResult'
import { RoleNew } from '../models/RoleNew'
import { RolesSortColumn } from '../models/RolesSortColumn'
import { SortDirection } from '../models/SortDirection'
import { ClientBase } from './ClientBase'

@Injectable({ providedIn: 'root' })
export class RoleClient extends ClientBase {
    constructor() {
        super('role')
    }

    public getAllRoles(): Observable<NameGuidPair[]> {
        return this.get<NameGuidPair[]>('allroles')
    }

    public getRoles(
        page: number,
        pageSize: number,
        searchText: string | null = null,
        sortColumn: RolesSortColumn = RolesSortColumn.Name,
        sortDirection: SortDirection = SortDirection.Ascending,
    ): Observable<PaginationResult<NameGuidPair>> {
        const params = this.paginationParams(page, pageSize, searchText, sortColumn, sortDirection)

        return this.get<PaginationResult<NameGuidPair>>('roles', params)
    }

    public getRole(id: string): Observable<NameGuidPair> {
        return this.get<NameGuidPair>(this.pathWithId('role', id))
    }

    public updateRole(role: NameGuidPair): Observable<NameGuidPair> {
        return this.post<NameGuidPair, NameGuidPair>('update', role)
    }

    public insertRole(role: RoleNew): Observable<NameGuidPair> {
        return this.post<NameGuidPair, RoleNew>('insert', role)
    }

    public deleteRole(id: string): Observable<boolean> {
        return this.delete<boolean>(this.pathWithId('delete', id))
    }
}
