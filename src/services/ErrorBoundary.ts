import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http'
import { ErrorHandler, Injectable, NgZone, signal } from '@angular/core'

export interface ApplicationError {
    message: string
    name: string
    suppressMessage: boolean
}

@Injectable({providedIn: 'root'})
export class ErrorBoundaryService {
    private readonly currentError = signal<ApplicationError | null>(null)

    readonly error = this.currentError.asReadonly()

    capture(error: unknown, name?: string, suppressMessage = false): void {
        const unwrappedError = this.unwrapRejection(error)
        const errorDetails = typeof unwrappedError === 'object' && unwrappedError !== null
            ? unwrappedError as {message?: unknown; name?: unknown}
            : null

        this.currentError.set({
            message: typeof errorDetails?.message === 'string' ? errorDetails.message : String(unwrappedError),
            name: name ?? (typeof errorDetails?.name === 'string' ? errorDetails.name : 'Error'),
            suppressMessage,
        })
    }

    captureUnhandledRejection(event: PromiseRejectionEvent): void {
        const suppressMessage = event.reason instanceof HttpErrorResponse
            && event.reason.status === HttpStatusCode.Forbidden

        this.capture(event.reason, event.type, suppressMessage)
    }

    private unwrapRejection(error: unknown): unknown {
        if (typeof error !== 'object' || error === null || !('rejection' in error)) {
            return error
        }

        return error.rejection
    }
}

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    constructor(
        private readonly errorBoundary: ErrorBoundaryService,
        private readonly ngZone: NgZone,
    ) {}

    handleError(error: unknown): void {
        console.error('Unhandled application error:', error)
        this.ngZone.run(() => this.errorBoundary.capture(error))
    }
}
