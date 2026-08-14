import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator'
import { MatSortModule, Sort } from '@angular/material/sort'
import { MatTableModule } from '@angular/material/table'
import { RouterLink } from '@angular/router'
import { debounceTime, distinctUntilChanged } from 'rxjs'
import { AppSnackbarService } from '../../components/AppSnackbar'
import { NameGuidPair } from '../../models/NameGuidPair'
import { emptyPaginationResult, PaginationResult } from '../../models/PaginationResult'
import { RolesSortColumn } from '../../models/RolesSortColumn'
import { SortDirection } from '../../models/SortDirection'
import { AppStateService } from '../../services/AppState'
import { RoleClient } from '../../services/RoleClient'
import { SuccessMessageService } from '../../services/SuccessMessage'

const PAGE_SIZE = 5

const sortColumns: Record<string, RolesSortColumn> = {
    Guid: RolesSortColumn.Id,
    Name: RolesSortColumn.Name,
}

@Component({
    standalone: true,
    imports: [
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatPaginatorModule,
        MatSortModule,
        MatTableModule,
        ReactiveFormsModule,
        RouterLink,
    ],
    templateUrl: 'roles.component.html',
    styleUrl: 'roles.component.scss',
})
export class RolesComponent implements OnInit {
    private readonly appState = inject(AppStateService)
    private readonly destroyRef = inject(DestroyRef)
    private readonly roleClient = inject(RoleClient)
    private readonly snackbar = inject(AppSnackbarService)
    private readonly successMessage = inject(SuccessMessageService)

    readonly displayedColumns = ['Guid', 'Name']
    readonly pageSize = PAGE_SIZE
    readonly paginationResult = signal<PaginationResult<NameGuidPair>>(emptyPaginationResult<NameGuidPair>())
    readonly page = signal(1)
    readonly sortColumn = signal(RolesSortColumn.Name)
    readonly sortDirection = signal(SortDirection.Ascending)
    readonly searchText = new FormControl('', {nonNullable: true})

    ngOnInit(): void {
        this.appState.setPageTitle('Roles')
        this.appState.firstBreadcrumb({title: 'Roles', url: '/roles'})

        this.searchText.valueChanges
            .pipe(
                debounceTime(250),
                distinctUntilChanged(),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe(() => {
                this.page.set(1)
                this.loadRoles()
            })

        const successMessage = this.successMessage.take()

        if (successMessage !== null) {
            this.snackbar.show(successMessage, 'success')
        }

        this.loadRoles()
    }

    sortChanged(sort: Sort): void {
        const sortColumn = sortColumns[sort.active]

        if (sortColumn === undefined) {
            return
        }

        let sortDirection = SortDirection.Ascending

        if (sort.direction === 'desc') {
            sortDirection = SortDirection.Descending
        }

        this.page.set(1)
        this.sortColumn.set(sortColumn)
        this.sortDirection.set(sortDirection)
        this.loadRoles()
    }

    pageChanged(event: PageEvent): void {
        const page = event.pageIndex + 1

        if (page === this.page()) {
            return
        }

        this.page.set(page)
        this.loadRoles()
    }

    private loadRoles(): void {
        this.roleClient.getRoles(
            this.page(),
            PAGE_SIZE,
            this.searchText.value,
            this.sortColumn(),
            this.sortDirection(),
        )
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(paginationResult => this.paginationResult.set(paginationResult))
    }
}
