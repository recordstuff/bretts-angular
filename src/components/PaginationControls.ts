import { Component, EventEmitter, Input, Output } from '@angular/core'
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator'
import { emptyPaginationResult, PaginationResult } from '../models/PaginationResult'

@Component({
    selector: 'app-pagination-controls',
    imports: [MatPaginatorModule],
    templateUrl: 'PaginationControls.html',
    styleUrl: 'PaginationControls.scss'
})
export class PaginationControlsComponent {
    @Input({required: true}) itemName = ''
    @Input({required: true}) page = 1
    @Input({required: true}) pageSize = 0
    @Input({required: true}) paginationResult: PaginationResult<unknown> = emptyPaginationResult<unknown>()
    @Output() readonly pageChange = new EventEmitter<PageEvent>()

    get ariaLabel(): string {
        return `Select ${this.itemName} page`
    }
}
