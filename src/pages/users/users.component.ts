import { Component, inject, ChangeDetectionStrategy } from '@angular/core'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { MatSortModule } from '@angular/material/sort'
import { MatTableModule } from '@angular/material/table'
import { RouterLink } from '@angular/router'
import { Observable, distinctUntilChanged, merge } from 'rxjs'
import { PaginatedListBase } from '../../components/PaginatedListBase'
import { PaginationControlsComponent } from '../../components/PaginationControls'
import { JwtRole } from '../../models/Jwt'
import { PaginationResult } from '../../models/PaginationResult'
import { UserSummary } from '../../models/UserSummary'
import { UsersSortColumn } from '../../models/UsersSortColumn'
import { AppStateService } from '../../services/AppState'
import { UserClient } from '../../services/UserClient'

const sortColumns: Record<string, UsersSortColumn> = {
    Guid: UsersSortColumn.Id,
    DisplayName: UsersSortColumn.DisplayName,
    Email: UsersSortColumn.Email,
}

@Component({
    imports: [
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        MatSortModule,
        MatTableModule,
        PaginationControlsComponent,
        ReactiveFormsModule,
        RouterLink,
    ],
    templateUrl: 'users.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: 'users.component.scss'
})
export class UsersComponent extends PaginatedListBase<UserSummary, UsersSortColumn> {
    private readonly appState = inject(AppStateService)
    private readonly userClient = inject(UserClient)

    readonly displayedColumns = ['Guid', 'DisplayName', 'Email']
    readonly roleFilter = new FormControl<JwtRole>(JwtRole.Any, {nonNullable: true})
    readonly roles = [
        {name: 'Any', value: JwtRole.Any},
        {name: 'User', value: JwtRole.User},
        {name: 'Admin', value: JwtRole.Admin},
    ]

    constructor() {
        super(UsersSortColumn.DisplayName, sortColumns)
    }

    protected override get filterChanges(): Observable<unknown> {
        return merge(
            super.filterChanges,
            this.roleFilter.valueChanges.pipe(distinctUntilChanged()),
        )
    }

    protected override configurePage(): void {
        this.appState.setPageTitle('Users')
        this.appState.firstBreadcrumb({title: 'Users', url: '/users'})
    }

    protected override getPage(): Observable<PaginationResult<UserSummary>> {
        return this.userClient.getUsers(
            this.page(),
            this.pageSize,
            this.searchText.value,
            this.roleFilter.value,
            this.sortColumn(),
            this.sortDirection(),
        )
    }
}
