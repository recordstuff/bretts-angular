import { Component, inject, ChangeDetectionStrategy } from '@angular/core'
import { RouterLink } from '@angular/router'
import { AppStateService } from '../services/AppState'

@Component({
    selector: 'app-breadcrumbinator',
    imports: [RouterLink],
    templateUrl: 'Breadcruminator.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: 'Breadcruminator.scss'
})
export class BreadcrumbinatorComponent {
    readonly appState = inject(AppStateService)
}
