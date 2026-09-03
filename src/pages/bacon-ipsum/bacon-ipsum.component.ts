import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core'
import { AppStateService } from '../../services/AppState'

@Component({
    standalone: true,
    templateUrl: 'bacon-ipsum.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: 'bacon-ipsum.component.scss',
})
export class BaconIpsumComponent implements OnInit {
    private readonly appState = inject(AppStateService)

    ngOnInit(): void {
        this.appState.setPageTitle('Bacon Ipsum')
        this.appState.firstBreadcrumb({title: 'Bacon Ipsum', url: '/baconipsum'})
    }
}
