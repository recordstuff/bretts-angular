import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http'
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing'
import { TestBed } from '@angular/core/testing'
import { environment } from '../environments/environment'
import { authInterceptor } from './AuthInterceptor'
import { JwtUtil } from './JwtUtil'

describe('authInterceptor', () => {
    let httpClient: HttpClient
    let httpTesting: HttpTestingController
    let jwtUtil: jasmine.SpyObj<JwtUtil>

    beforeEach(() => {
        jwtUtil = jasmine.createSpyObj<JwtUtil>('JwtUtil', [], { token: 'test-token' })

        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(withInterceptors([authInterceptor])),
                provideHttpClientTesting(),
                { provide: JwtUtil, useValue: jwtUtil },
            ],
        })

        httpClient = TestBed.inject(HttpClient)
        httpTesting = TestBed.inject(HttpTestingController)
    })

    afterEach(() => httpTesting.verify())

    it('adds the environment API URL, bearer token, and credentials to relative requests', () => {
        httpClient.get('user/users').subscribe()

        const apiRoot = environment.apiUrl.replace(/\/+$/, '')
        const request = httpTesting.expectOne(`${apiRoot}/user/users`)

        expect(request.request.headers.get('Accept')).toBe('application/json')
        expect(request.request.headers.get('Authorization')).toBe('Bearer test-token')
        expect(request.request.headers.get('X-Requested-With')).toBe('XMLHttpRequest')
        expect(request.request.withCredentials).toBeTrue()

        request.flush({})
    })

    it('does not modify absolute requests to another origin', () => {
        httpClient.get('https://example.com/data').subscribe()

        const request = httpTesting.expectOne('https://example.com/data')

        expect(request.request.headers.has('Authorization')).toBeFalse()
        expect(request.request.withCredentials).toBeFalse()

        request.flush({})
    })

    it('omits the authorization header when no token is available', () => {
        const tokenGetter = Object.getOwnPropertyDescriptor(jwtUtil, 'token')?.get as jasmine.Spy
        tokenGetter.and.returnValue('')

        httpClient.post('user/login', {}).subscribe()

        const apiRoot = environment.apiUrl.replace(/\/+$/, '')
        const request = httpTesting.expectOne(`${apiRoot}/user/login`)
        expect(request.request.headers.has('Authorization')).toBeFalse()
        request.flush({})
    })
})
