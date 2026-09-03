import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'

@Component({
    selector: 'app-entity-form-actions',
    imports: [MatButtonModule],
    templateUrl: 'EntityFormActions.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: 'EntityFormActions.scss'
})
export class EntityFormActionsComponent {
    @Input({required: true}) isEdit = false
    @Input({required: true}) isSaving = false
    @Output() readonly cancelled = new EventEmitter<void>()
    @Output() readonly deleteRequested = new EventEmitter<void>()
}
