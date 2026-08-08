import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator'
import { MatSelectModule } from '@angular/material/select'
import { Sort, MatSortModule } from '@angular/material/sort'
import { MatTableModule } from '@angular/material/table'
import { RouterLink } from '@angular/router'
import { debounceTime, distinctUntilChanged, merge } from 'rxjs'
import { AppSnackbarService } from '../../components/AppSnackbar'
import { JwtRole } from '../../models/Jwt'
import { emptyPaginationResult, PaginationResult } from '../../models/PaginationResult'
import { SortDirection } from '../../models/SortDirection'
import { UserSummary } from '../../models/UserSummary'
import { UsersSortColumn } from '../../models/UsersSortColumn'
import { AppStateService } from '../../services/AppState'
import { SuccessMessageService } from '../../services/SuccessMessage'
import { UserClient } from '../../services/UserClient'

const PAGE_SIZE = 5

const sortColumns: Record<string, UsersSortColumn> = {
    Guid: UsersSortColumn.Id,
    DisplayName: UsersSortColumn.DisplayName,
    Email: UsersSortColumn.Email,
}

@Component({
    standalone: true,
    imports: [
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatPaginatorModule,
        MatSelectModule,
        MatSortModule,
        MatTableModule,
        ReactiveFormsModule,
        RouterLink,
    ],
    templateUrl: 'users.component.html',
    styleUrl: 'users.component.scss',
})
export class UsersComponent implements OnInit {
    private readonly appState = inject(AppStateService)
    private readonly destroyRef = inject(DestroyRef)
    private readonly snackbar = inject(AppSnackbarService)
    private readonly successMessage = inject(SuccessMessageService)
    private readonly userClient = inject(UserClient)

    readonly displayedColumns = ['Guid', 'DisplayName', 'Email']
    readonly pageSize = PAGE_SIZE
    readonly paginationResult = signal<PaginationResult<UserSummary>>(emptyPaginationResult<UserSummary>())
    readonly page = signal(1)
    readonly sortColumn = signal(UsersSortColumn.DisplayName)
    readonly sortDirection = signal(SortDirection.Ascending)
    readonly searchText = new FormControl('', {nonNullable: true})
    readonly roleFilter = new FormControl<JwtRole>(JwtRole.Any, {nonNullable: true})
    readonly roles = [
        {name: 'Any', value: JwtRole.Any},
        {name: 'User', value: JwtRole.User},
        {name: 'Admin', value: JwtRole.Admin},
    ]

    ngOnInit(): void {
        this.appState.setPageTitle('Users')
        this.appState.firstBreadcrumb({title: 'Users', url: '/users'})

        merge(
            this.searchText.valueChanges.pipe(debounceTime(250), distinctUntilChanged()),
            this.roleFilter.valueChanges.pipe(distinctUntilChanged()),
        )
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.page.set(1)
                this.loadUsers()
            })

        const successMessage = this.successMessage.take()

        if (successMessage !== null) {
            this.snackbar.show(successMessage, 'success')
        }

        this.loadUsers()
    }

    sortChanged(sort: Sort): void {
        const sortColumn = sortColumns[sort.active]

        if (sortColumn === undefined) {
            return
        }

        this.page.set(1)
        this.sortColumn.set(sortColumn)
        this.sortDirection.set(sort.direction === 'desc'
            ? SortDirection.Descending
            : SortDirection.Ascending)
        this.loadUsers()
    }

    pageChanged(event: PageEvent): void {
        const page = event.pageIndex + 1

        if (page === this.page()) {
            return
        }

        this.page.set(page)
        this.loadUsers()
    }

    private loadUsers(): void {
        this.userClient.getUsers(
            this.page(),
            PAGE_SIZE,
            this.searchText.value,
            this.roleFilter.value,
            this.sortColumn(),
            this.sortDirection(),
        )
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(paginationResult => this.paginationResult.set(paginationResult))
    }
}
