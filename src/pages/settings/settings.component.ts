import { Component, DestroyRef, OnInit, inject } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { MatButtonModule } from '@angular/material/button'
import { AppSnackbarService } from '../../components/AppSnackbar'
import { AppStateService } from '../../services/AppState'
import { TestClient } from '../../services/TestClient'

@Component({
    standalone: true,
    imports: [MatButtonModule],
    templateUrl: 'settings.component.html',
    styleUrl: 'settings.component.scss',
})
export class SettingsComponent implements OnInit {
    private readonly appState = inject(AppStateService)
    private readonly destroyRef = inject(DestroyRef)
    private readonly snackbar = inject(AppSnackbarService)
    private readonly testClient = inject(TestClient)

    ngOnInit(): void {
        this.appState.setPageTitle('Settings')
        this.appState.firstBreadcrumb({title: 'Settings', url: '/settings'})
    }

    throwError(): void {
        this.testClient.throwError().subscribe()
    }

    writeLogEntry(): void {
        this.testClient.writeLogEntry()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => this.snackbar.show('The test log entry was written.', 'success'),
                error: () => this.snackbar.show('The test log entry could not be written.', 'error'),
            })
    }

    shutdown(): void {
        this.testClient.shutdown()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => this.snackbar.show('The backend shutdown was requested.', 'success'),
                error: () => this.snackbar.show('The backend shutdown could not be requested.', 'error'),
            })
    }
}
