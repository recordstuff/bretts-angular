import { Component, inject } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatSortModule } from '@angular/material/sort'
import { MatTableModule } from '@angular/material/table'
import { RouterLink } from '@angular/router'
import { Observable } from 'rxjs'
import { PaginatedListBase } from '../../components/PaginatedListBase'
import { PaginationControlsComponent } from '../../components/PaginationControls'
import { NameGuidPair } from '../../models/NameGuidPair'
import { PaginationResult } from '../../models/PaginationResult'
import { RolesSortColumn } from '../../models/RolesSortColumn'
import { AppStateService } from '../../services/AppState'
import { RoleClient } from '../../services/RoleClient'

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
        MatSortModule,
        MatTableModule,
        PaginationControlsComponent,
        ReactiveFormsModule,
        RouterLink,
    ],
    templateUrl: 'roles.component.html',
    styleUrl: 'roles.component.scss',
})
export class RolesComponent extends PaginatedListBase<NameGuidPair, RolesSortColumn> {
    private readonly appState = inject(AppStateService)
    private readonly roleClient = inject(RoleClient)

    readonly displayedColumns = ['Guid', 'Name']

    constructor() {
        super(RolesSortColumn.Name, sortColumns)
    }

    protected override configurePage(): void {
        this.appState.setPageTitle('Roles')
        this.appState.firstBreadcrumb({title: 'Roles', url: '/roles'})
    }

    protected override getPage(): Observable<PaginationResult<NameGuidPair>> {
        return this.roleClient.getRoles(
            this.page(),
            this.pageSize,
            this.searchText.value,
            this.sortColumn(),
            this.sortDirection(),
        )
    }
}
