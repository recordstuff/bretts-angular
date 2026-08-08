import { Component, Injectable, inject } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import {
    MAT_SNACK_BAR_DATA,
    MatSnackBar,
    MatSnackBarRef,
} from '@angular/material/snack-bar'

export type AppSnackbarSeverity = 'success' | 'info' | 'warning' | 'error'

export interface AppSnackbarData {
    message: string
    severity: AppSnackbarSeverity
}

const severityIcons: Record<AppSnackbarSeverity, string> = {
    success: 'check_circle',
    info: 'info',
    warning: 'warning',
    error: 'error',
}

@Component({
    selector: 'app-snackbar',
    standalone: true,
    imports: [MatButtonModule, MatIconModule],
    templateUrl: 'AppSnackbar.html',
    styleUrl: 'AppSnackbar.scss',
})
export class AppSnackbarComponent {
    readonly data = inject<AppSnackbarData>(MAT_SNACK_BAR_DATA)
    private readonly snackbarRef = inject(MatSnackBarRef<AppSnackbarComponent>)

    get icon(): string {
        return severityIcons[this.data.severity]
    }

    dismiss(): void {
        this.snackbarRef.dismiss()
    }
}

@Injectable({providedIn: 'root'})
export class AppSnackbarService {
    private readonly snackbar = inject(MatSnackBar)

    show(message: string, severity: AppSnackbarSeverity): void {
        this.snackbar.openFromComponent(AppSnackbarComponent, {
            announcementMessage: message,
            data: {message, severity},
            duration: 4000,
            horizontalPosition: 'center',
            panelClass: ['app-snackbar-panel', `app-snackbar-${severity}`],
            politeness: severity === 'warning' || severity === 'error' ? 'assertive' : 'polite',
            verticalPosition: 'top',
        })
    }

    dismiss(): void {
        this.snackbar.dismiss()
    }
}
