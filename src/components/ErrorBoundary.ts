import { Component, DestroyRef, inject } from '@angular/core'
import { ErrorBoundaryService } from '../services/ErrorBoundary'

@Component({
    selector: 'app-error-boundary',
    standalone: true,
    templateUrl: 'ErrorBoundary.html',
    styleUrl: 'ErrorBoundary.scss',
})
export class ErrorBoundaryComponent {
    private readonly destroyRef = inject(DestroyRef)
    readonly errorBoundary = inject(ErrorBoundaryService)

    private readonly errorListener = (event: ErrorEvent): void => {
        this.errorBoundary.capture(event.message, 'Error')
    }

    private readonly unhandledRejectionListener = (event: PromiseRejectionEvent): void => {
        this.errorBoundary.captureUnhandledRejection(event)
    }

    constructor() {
        window.addEventListener('error', this.errorListener)
        window.addEventListener('unhandledrejection', this.unhandledRejectionListener)

        this.destroyRef.onDestroy(() => {
            window.removeEventListener('error', this.errorListener)
            window.removeEventListener('unhandledrejection', this.unhandledRejectionListener)
        })
    }
}
