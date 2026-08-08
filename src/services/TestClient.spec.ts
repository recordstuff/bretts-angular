import { provideHttpClient } from '@angular/common/http'
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing'
import { TestBed } from '@angular/core/testing'
import { TestClient } from './TestClient'

describe('TestClient', () => {
    let client: TestClient
    let httpTesting: HttpTestingController

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()],
        })

        client = TestBed.inject(TestClient)
        httpTesting = TestBed.inject(HttpTestingController)
    })

    afterEach(() => httpTesting.verify())

    it('calls the deliberate backend error endpoint', () => {
        client.throwError().subscribe()

        const request = httpTesting.expectOne('test/throwerror')
        expect(request.request.method).toBe('GET')
        request.flush(null)
    })
})
