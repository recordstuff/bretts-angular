import { DestroyRef, Directive, OnInit, WritableSignal, inject, signal } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { FormControl } from '@angular/forms'
import { PageEvent } from '@angular/material/paginator'
import { Sort } from '@angular/material/sort'
import { Observable, debounceTime, distinctUntilChanged } from 'rxjs'
import { emptyPaginationResult, PaginationResult } from '../models/PaginationResult'
import { SortDirection } from '../models/SortDirection'
import { SuccessMessageService } from '../services/SuccessMessage'
import { AppSnackbarService } from './AppSnackbar'

const PAGE_SIZE = 5

@Directive()
export abstract class PaginatedListBase<TItem, TSortColumn> implements OnInit {
    private readonly destroyRef = inject(DestroyRef)
    private readonly snackbar = inject(AppSnackbarService)
    private readonly successMessage = inject(SuccessMessageService)

    readonly page = signal(1)
    readonly pageSize = PAGE_SIZE
    readonly paginationResult = signal<PaginationResult<TItem>>(emptyPaginationResult<TItem>())
    readonly searchText = new FormControl('', {nonNullable: true})
    readonly sortColumn: WritableSignal<TSortColumn>
    readonly sortDirection = signal(SortDirection.Ascending)

    protected constructor(
        defaultSortColumn: TSortColumn,
        private readonly sortColumns: Readonly<Record<string, TSortColumn>>,
    ) {
        this.sortColumn = signal(defaultSortColumn)
    }

    ngOnInit(): void {
        this.configurePage()

        this.filterChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.page.set(1)
                this.loadPage()
            })

        const successMessage = this.successMessage.take()

        if (successMessage !== null) {
            this.snackbar.show(successMessage, 'success')
        }

        this.loadPage()
    }

    sortChanged(sort: Sort): void {
        const sortColumn = this.sortColumns[sort.active]

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
        this.loadPage()
    }

    pageChanged(event: PageEvent): void {
        const page = event.pageIndex + 1

        if (page === this.page()) {
            return
        }

        this.page.set(page)
        this.loadPage()
    }

    protected get filterChanges(): Observable<unknown> {
        return this.searchText.valueChanges.pipe(debounceTime(250), distinctUntilChanged())
    }

    protected abstract configurePage(): void

    protected abstract getPage(): Observable<PaginationResult<TItem>>

    private loadPage(): void {
        this.getPage()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(paginationResult => this.paginationResult.set(paginationResult))
    }
}
