import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http'
import { ErrorHandler, Injectable, signal } from '@angular/core'

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
        this.currentError.set({
            message: error instanceof Error ? error.message : String(error),
            name: name ?? (error instanceof Error ? error.name : 'Error'),
            suppressMessage,
        })
    }

    captureUnhandledRejection(event: PromiseRejectionEvent): void {
        const suppressMessage = event.reason instanceof HttpErrorResponse
            && event.reason.status === HttpStatusCode.Forbidden

        this.capture(event.reason, event.type, suppressMessage)
    }
}

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    constructor(private readonly errorBoundary: ErrorBoundaryService) {}

    handleError(error: unknown): void {
        console.error('Unhandled application error:', error)
        this.errorBoundary.capture(error)
    }
}
