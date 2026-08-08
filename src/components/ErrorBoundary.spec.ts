import { ComponentFixture, TestBed } from '@angular/core/testing'
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http'
import { ErrorBoundaryComponent } from './ErrorBoundary'

describe('ErrorBoundaryComponent', () => {
    let fixture: ComponentFixture<ErrorBoundaryComponent>
    let errorListener: EventListener
    let unhandledRejectionListener: EventListener

    beforeEach(async () => {
        const addEventListener = spyOn(window, 'addEventListener').and.callThrough()

        await TestBed.configureTestingModule({
            imports: [ErrorBoundaryComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(ErrorBoundaryComponent)
        fixture.detectChanges()

        errorListener = addEventListener.calls.allArgs()
            .find(([eventName]) => eventName === 'error')?.[1] as EventListener
        unhandledRejectionListener = addEventListener.calls.allArgs()
            .find(([eventName]) => eventName === 'unhandledrejection')?.[1] as EventListener
    })

    it('registers native listeners for global errors and unhandled promise rejections', () => {
        expect(errorListener).toBeDefined()
        expect(unhandledRejectionListener).toBeDefined()
    })

    it('shows the fallback screen for a global JavaScript error', () => {
        errorListener(new ErrorEvent('error', {message: 'Something broke'}))
        fixture.detectChanges()

        expect(fixture.nativeElement.querySelector('h1').textContent).toContain('Unfortunate Occurrence')
        expect(fixture.nativeElement.querySelector('.error-message').textContent).toContain('Something broke')
    })

    it('shows the fallback screen for an unhandled promise rejection', () => {
        unhandledRejectionListener({
            reason: new Error('Promise failed'),
            type: 'unhandledrejection',
        } as PromiseRejectionEvent)
        fixture.detectChanges()

        expect(fixture.nativeElement.querySelector('.error-message').textContent).toContain('Promise failed')
    })

    it('suppresses an unhandled forbidden response like the NextJS boundary', () => {
        unhandledRejectionListener({
            reason: new HttpErrorResponse({status: HttpStatusCode.Forbidden}),
            type: 'unhandledrejection',
        } as PromiseRejectionEvent)
        fixture.detectChanges()

        expect(fixture.nativeElement.querySelector('.error-page')).toBeNull()
    })
})
