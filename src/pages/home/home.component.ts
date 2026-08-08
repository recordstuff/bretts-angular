import { Component, OnInit, inject } from '@angular/core';
import { AppStateService } from '../../services/AppState';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit {
    private readonly appState = inject(AppStateService)

    ngOnInit(): void {
        this.appState.setPageTitle('Home')
    }
}
