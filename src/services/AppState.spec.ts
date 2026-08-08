import { AppStateService } from './AppState'

describe('AppStateService', () => {
    const sessionKey = 'OurBreadcrumbs'

    beforeEach(() => sessionStorage.removeItem(sessionKey))
    afterEach(() => sessionStorage.removeItem(sessionKey))

    it('replaces the breadcrumb trail with the first breadcrumb', () => {
        const service = new AppStateService()

        service.addBreadcrumb({title: 'Old Page', url: '/old'})
        service.firstBreadcrumb({title: 'Users', url: '/users'})

        expect(service.breadcrumbs()).toEqual([{title: 'Users', url: '/users'}])
        expect(JSON.parse(sessionStorage.getItem(sessionKey)!)).toEqual([{title: 'Users', url: '/users'}])
    })

    it('appends a breadcrumb without duplicating the last page', () => {
        const service = new AppStateService()

        service.firstBreadcrumb({title: 'Users', url: '/users'})
        service.addBreadcrumb({title: 'Edit User', url: '/user/123'})
        service.addBreadcrumb({title: 'Edit User', url: '/user/123'})

        expect(service.breadcrumbs()).toEqual([
            {title: 'Users', url: '/users'},
            {title: 'Edit User', url: '/user/123'},
        ])
    })

    it('restores the persisted breadcrumb trail', () => {
        sessionStorage.setItem(sessionKey, JSON.stringify([
            {title: 'Users', url: '/users'},
            {title: 'Add User', url: '/user'},
        ]))

        const service = new AppStateService()

        expect(service.breadcrumbs()).toEqual([
            {title: 'Users', url: '/users'},
            {title: 'Add User', url: '/user'},
        ])
    })
})
