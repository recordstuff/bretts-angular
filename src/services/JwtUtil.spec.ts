import { TestBed } from '@angular/core/testing'
import { Jwt } from '../models/Jwt'
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
        }
        const encodedBody = btoa(JSON.stringify(jwt)).replace(/=+$/, '')
        const encodedToken = `header.${encodedBody}.signature`

        jwtUtil.token = encodedToken

        expect(jwtUtil.token).toBe(encodedToken)
        expect(jwtUtil.isExpired).toBeFalse()
        expect(sessionStorage.getItem('accessTokenExpiration')).toBe(expiration.toString())
        expect(localStorage.getItem('accessToken')).toBeNull()
    })

    it('clears the session token', () => {
        sessionStorage.setItem('accessToken', 'sample-token')
        sessionStorage.setItem('accessTokenExpiration', '123')

        jwtUtil.clear()

        expect(jwtUtil.token).toBe('')
        expect(jwtUtil.isExpired).toBeTrue()
    })
})
