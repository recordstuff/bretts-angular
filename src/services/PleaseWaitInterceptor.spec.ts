import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http'
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing'
import { TestBed } from '@angular/core/testing'
import { PleaseWaitService } from './PleaseWait'
import { pleaseWaitInterceptor } from './PleaseWaitInterceptor'

describe('pleaseWaitInterceptor', () => {
    let httpClient: HttpClient
    let httpTesting: HttpTestingController
    let pleaseWait: jasmine.SpyObj<PleaseWaitService>

    beforeEach(() => {
        pleaseWait = jasmine.createSpyObj<PleaseWaitService>('PleaseWaitService', [
            'pleaseWait',
            'doneWaiting',
        ])

        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(withInterceptors([pleaseWaitInterceptor])),
                provideHttpClientTesting(),
                {provide: PleaseWaitService, useValue: pleaseWait},
            ],
        })

        httpClient = TestBed.inject(HttpClient)
        httpTesting = TestBed.inject(HttpTestingController)
    })

    afterEach(() => httpTesting.verify())

    it('waits for successful HTTP requests', () => {
        httpClient.get('/test').subscribe()

        expect(pleaseWait.pleaseWait).toHaveBeenCalled()
        expect(pleaseWait.doneWaiting).not.toHaveBeenCalled()

        httpTesting.expectOne('/test').flush({})

        expect(pleaseWait.doneWaiting).toHaveBeenCalled()
    })

    it('finishes waiting when an HTTP request fails', () => {
        httpClient.get('/test').subscribe({error: () => undefined})

        httpTesting.expectOne('/test').flush(null, {status: 500, statusText: 'Server Error'})

        expect(pleaseWait.doneWaiting).toHaveBeenCalled()
    })
})
