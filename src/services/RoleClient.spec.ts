import { provideHttpClient } from '@angular/common/http'
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing'
import { TestBed } from '@angular/core/testing'
import { RoleClient } from './RoleClient'

describe('RoleClient', () => {
    let client: RoleClient
    let httpTesting: HttpTestingController

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()],
        })

        client = TestBed.inject(RoleClient)
        httpTesting = TestBed.inject(HttpTestingController)
    })

    afterEach(() => httpTesting.verify())

    it('gets assignable roles', () => {
        client.getAllRoles().subscribe()

        const request = httpTesting.expectOne('roles/allroles')
        expect(request.request.method).toBe('GET')
        request.flush([])
    })
})
