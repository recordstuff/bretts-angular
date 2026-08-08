import { Component, OnInit, inject } from '@angular/core'
import { AppStateService } from '../../services/AppState'

@Component({
    standalone: true,
    template: '',
})
export class BaconIpsumComponent implements OnInit {
    private readonly appState = inject(AppStateService)

    ngOnInit(): void {
        this.appState.setPageTitle('Bacon Ipsum')
    }
}
