import { TestBed } from '@angular/core/testing'
import { ErrorBoundaryService, GlobalErrorHandler } from './ErrorBoundary'

describe('ErrorBoundaryService', () => {
    it('normalizes an Error for the fallback screen', () => {
        const service = TestBed.inject(ErrorBoundaryService)

        service.capture(new TypeError('Unexpected value'))

        expect(service.error()).toEqual({
            message: 'Unexpected value',
            name: 'TypeError',
            suppressMessage: false,
        })
    })

    it('normalizes Angular error-shaped objects for the fallback screen', () => {
        const service = TestBed.inject(ErrorBoundaryService)

        service.capture({message: 'HTTP request failed', name: 'HttpErrorResponse'})

        expect(service.error()).toEqual({
            message: 'HTTP request failed',
            name: 'HttpErrorResponse',
            suppressMessage: false,
        })
    })
})

describe('GlobalErrorHandler', () => {
    it('reports Angular errors to the shared boundary state', () => {
        TestBed.configureTestingModule({providers: [GlobalErrorHandler]})
        const errorBoundary = TestBed.inject(ErrorBoundaryService)
        const errorHandler = TestBed.inject(GlobalErrorHandler)
        spyOn(console, 'error')

        errorHandler.handleError(new Error('Angular failed'))

        expect(errorBoundary.error()?.message).toBe('Angular failed')
        expect(console.error).toHaveBeenCalled()
    })
})
