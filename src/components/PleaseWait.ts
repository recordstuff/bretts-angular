import { Component, inject, ChangeDetectionStrategy } from '@angular/core'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { PleaseWaitService } from '../services/PleaseWait'

@Component({
    selector: 'app-please-wait',
    imports: [MatProgressSpinnerModule],
    templateUrl: 'PleaseWait.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: 'PleaseWait.scss'
})
export class PleaseWaitComponent {
    readonly pleaseWait = inject(PleaseWaitService)
}
