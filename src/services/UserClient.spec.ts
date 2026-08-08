import { provideHttpClient } from '@angular/common/http'
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing'
import { TestBed } from '@angular/core/testing'
import { JwtRole } from '../models/Jwt'
import { SortDirection } from '../models/SortDirection'
import { UserCredentials } from '../models/UserCredentials'
import { UsersSortColumn } from '../models/UsersSortColumn'
import { UserClient } from './UserClient'

describe('UserClient', () => {
    let client: UserClient
    let httpTesting: HttpTestingController

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()],
        })

        client = TestBed.inject(UserClient)
        httpTesting = TestBed.inject(HttpTestingController)
    })

    afterEach(() => httpTesting.verify())

    it('posts credentials to the login endpoint', () => {
        const credentials: UserCredentials = { Email: 'user@example.com', Password: 'password' }

        client.login(credentials).subscribe()

        const request = httpTesting.expectOne('user/login')
        expect(request.request.method).toBe('POST')
        expect(request.request.body).toEqual(credentials)
        request.flush({ DisplayName: '', ExpirationSeconds: 0, Roles: [], Token: '' })
    })

    it('sends paging, filtering, and sorting query parameters', () => {
        client.getUsers(
            2,
            25,
            'brett',
            JwtRole.Admin,
            UsersSortColumn.Email,
            SortDirection.Descending,
        ).subscribe()

        const request = httpTesting.expectOne(request => request.url === 'user/users')
        expect(request.request.method).toBe('GET')
        expect(request.request.params.get('page')).toBe('2')
        expect(request.request.params.get('pageSize')).toBe('25')
        expect(request.request.params.get('searchText')).toBe('brett')
        expect(request.request.params.get('roleFilter')).toBe(JwtRole.Admin)
        expect(request.request.params.get('sortColumn')).toBe(UsersSortColumn.Email.toString())
        expect(request.request.params.get('sortDirection')).toBe(SortDirection.Descending.toString())
        request.flush({ Page: 2, PageCount: 2, ItemCount: 26, Items: [] })
    })

    it('exposes the user detail mutation endpoints', () => {
        const id = '00000000-0000-0000-0000-000000000001'
        const user = { Guid: id, Email: 'user@example.com', DisplayName: 'User', Phone: null, Roles: [] }

        client.getUser(id).subscribe()
        httpTesting.expectOne(`user/user/${id}`).flush(user)

        client.updateUser(user).subscribe()
        const update = httpTesting.expectOne('user/update')
        expect(update.request.method).toBe('POST')
        expect(update.request.body).toEqual(user)
        update.flush(user)

        client.insertUser({ ...user, Password: 'password' }).subscribe()
        const insert = httpTesting.expectOne('user/insert')
        expect(insert.request.method).toBe('POST')
        insert.flush(user)

        client.deleteUser(id).subscribe()
        const remove = httpTesting.expectOne(`user/delete/${id}`)
        expect(remove.request.method).toBe('DELETE')
        remove.flush(true)
    })
})
