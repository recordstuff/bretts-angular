import { Component, OnInit, inject } from '@angular/core'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { AppStateService } from '../../services/AppState'

@Component({
    standalone: true,
    imports: [MatFormFieldModule, MatInputModule],
    templateUrl: 'example-two.component.html',
    styleUrl: 'example-two.component.scss',
})
export class ExampleTwoComponent implements OnInit {
    private readonly appState = inject(AppStateService)
    readonly fieldNumbers = [1, 2, 3, 4, 5, 6] as const

    ngOnInit(): void {
        this.appState.setPageTitle('Example Two')
    }
}
