import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core'
import { MatCardModule } from '@angular/material/card'
import { MatIconModule } from '@angular/material/icon'
import { MatRippleModule } from '@angular/material/core'
import { RouterLink } from '@angular/router'
import { AppStateService } from '../../services/AppState'

@Component({
    imports: [MatCardModule, MatIconModule, MatRippleModule, RouterLink],
    templateUrl: 'home.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: 'home.component.scss'
})
export class HomeComponent implements OnInit {
    private readonly appState = inject(AppStateService)

    ngOnInit(): void {
        this.appState.setPageTitle('Home')
        this.appState.firstBreadcrumb({title: 'Home', url: '/'})
    }
}
