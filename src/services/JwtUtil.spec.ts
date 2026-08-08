import { TestBed } from '@angular/core/testing'
import { Jwt, JWT_ROLE_CLAIM, JwtRole } from '../models/Jwt'
import { JwtUtil } from './JwtUtil'

describe('JwtUtil', () => {
    let jwtUtil: JwtUtil

    beforeEach(() => {
        TestBed.configureTestingModule({})
        jwtUtil = TestBed.inject(JwtUtil)
        sessionStorage.clear()
        localStorage.clear()
    })

    afterEach(() => {
        sessionStorage.clear()
        localStorage.clear()
    })

    it('stores the token and expiration in session storage only', () => {
        const expiration = Math.floor(Date.now() / 1000) + 60
        const jwt: Jwt = {
            sub: 'sample-user',
            jti: 'sample-token',
            displayName: 'Sample User',
            exp: expiration,
            iss: 'sample-issuer',
            aud: 'sample-audience',
            [JWT_ROLE_CLAIM]: [JwtRole.Admin, JwtRole.User],
        }
        const encodedBody = btoa(JSON.stringify(jwt)).replace(/=+$/, '')
        const encodedToken = `header.${encodedBody}.signature`

        jwtUtil.token = encodedToken

        expect(jwtUtil.token).toBe(encodedToken)
        expect(jwtUtil.isExpired).toBeFalse()
        expect(jwtUtil.displayName).toBe('Sample User')
        expect(jwtUtil.hasRole(JwtRole.Any)).toBeTrue()
        expect(jwtUtil.hasRole(JwtRole.Admin)).toBeTrue()
        expect(jwtUtil.hasRole(JwtRole.User)).toBeTrue()
        expect(jwtUtil.hasMultipleRoles()).toBeTrue()
        expect(sessionStorage.getItem('exp')).toBe(expiration.toString())
        expect(localStorage.getItem('accessToken')).toBeNull()
    })

    it('clears the session token', () => {
        sessionStorage.setItem('accessToken', 'sample-token')
        sessionStorage.setItem('exp', '123')
        sessionStorage.setItem('displayName', 'Sample User')
        sessionStorage.setItem(JWT_ROLE_CLAIM, JSON.stringify([JwtRole.Admin]))

        jwtUtil.clear()

        expect(jwtUtil.token).toBe('')
        expect(jwtUtil.displayName).toBe('')
        expect(jwtUtil.isExpired).toBeTrue()
        expect(sessionStorage.getItem(JWT_ROLE_CLAIM)).toBeNull()
    })

    it('normalizes a single role claim from the token', () => {
        const expiration = Math.floor(Date.now() / 1000) + 60
        const jwt: Jwt = {
            sub: 'sample-user',
            jti: 'sample-token',
            displayName: 'Sample User',
            exp: expiration,
            iss: 'sample-issuer',
            aud: 'sample-audience',
            [JWT_ROLE_CLAIM]: JwtRole.User,
        }
        const encodedBody = btoa(JSON.stringify(jwt)).replace(/=+$/, '')

        jwtUtil.token = `header.${encodedBody}.signature`

        expect(jwtUtil.hasRole(JwtRole.User)).toBeTrue()
        expect(jwtUtil.hasRole(JwtRole.Admin)).toBeFalse()
        expect(jwtUtil.hasMultipleRoles()).toBeFalse()
    })
})
