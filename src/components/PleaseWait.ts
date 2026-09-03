import { Component, inject } from '@angular/core'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { PleaseWaitService } from '../services/PleaseWait'

@Component({
    selector: 'app-please-wait',
    imports: [MatProgressSpinnerModule],
    templateUrl: 'PleaseWait.html',
    styleUrl: 'PleaseWait.scss'
})
export class PleaseWaitComponent {
    readonly pleaseWait = inject(PleaseWaitService)
}
