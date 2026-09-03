import { Component, inject, ChangeDetectionStrategy } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog'
import { MatIconModule } from '@angular/material/icon'

export interface YesNoDialogData {
    question: string
}

@Component({
    selector: 'app-yes-no-dialog',
    imports: [MatButtonModule, MatDialogModule, MatIconModule],
    templateUrl: 'YesNoDialog.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: 'YesNoDialog.scss'
})
export class YesNoDialogComponent {
    readonly data = inject<YesNoDialogData>(MAT_DIALOG_DATA)
}
