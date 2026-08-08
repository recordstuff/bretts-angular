import { Component, OnInit, inject } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
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
    private readonly testClient = inject(TestClient)

    ngOnInit(): void {
        this.appState.setPageTitle('Settings')
        this.appState.firstBreadcrumb({title: 'Settings', url: '/settings'})
    }

    throwError(): void {
        this.testClient.throwError().subscribe()
    }

    writeLogEntry(): void {
        this.testClient.writeLogEntry().subscribe()
    }

    shutdown(): void {
        this.testClient.shutdown().subscribe()
    }
}
