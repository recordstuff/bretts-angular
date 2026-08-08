import { Component, OnInit, inject } from '@angular/core'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { AppStateService } from '../../services/AppState'

@Component({
    standalone: true,
    imports: [MatFormFieldModule, MatInputModule],
    templateUrl: 'grid-example.component.html',
    styleUrl: 'grid-example.component.scss',
})
export class GridExampleComponent implements OnInit {
    private readonly appState = inject(AppStateService)

    ngOnInit(): void {
        this.appState.setPageTitle('Grid Example')
    }
}
