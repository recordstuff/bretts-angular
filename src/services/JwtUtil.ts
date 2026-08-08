import { Injectable } from "@angular/core"
import { Jwt, JWT_ROLE_CLAIM, JwtRole } from "../models/Jwt"

@Injectable({providedIn: 'root'})
export class JwtUtil {
    private readonly encodedTokenName: string = "accessToken"
    private readonly expirationName: keyof Jwt = "exp"
    private readonly displayNameName: keyof Jwt = "displayName"
    
    public get isExpired() : boolean {
        const expirationSecondsStr = sessionStorage.getItem(this.expirationName)

        if (expirationSecondsStr === null) return true

        const expirationSeconds = parseInt(expirationSecondsStr)

        return expirationSeconds <= Date.now() / 1000
    }

    public get token(): string {
        return sessionStorage.getItem(this.encodedTokenName) ?? ''
    }

    public get displayName(): string {
        return sessionStorage.getItem(this.displayNameName) ?? ''
    }

    public hasRole(role: JwtRole): boolean {
        if (this.isExpired) return false

        if (role === JwtRole.Any) return true

        const rolesStr = sessionStorage.getItem(JWT_ROLE_CLAIM)

        if (rolesStr === null) return false

        const roles: string[] = JSON.parse(rolesStr)

        return roles.indexOf(role) >= 0
    }

    public hasMultipleRoles(): boolean {
        if (this.isExpired) return false

        const rolesStr = sessionStorage.getItem(JWT_ROLE_CLAIM)

        if (rolesStr === null) return false

        const roles: string[] = JSON.parse(rolesStr)

        return roles.length > 1
    }

    public set token(encodedToken: string) {
        try {
            if (encodedToken.length > 0) {
                const parts = encodedToken.split('.')
                let body = parts[1]
                    .replaceAll('-', '+')
                    .replaceAll('_', '/')
                const padding = (4 - body.length % 4) % 4
                body = body.padEnd(body.length + padding, '=')

                const jwt: Jwt = JSON.parse(atob(body))

                const expirationSeconds = jwt.exp
                const displayName = jwt.displayName
                let roles = jwt[JWT_ROLE_CLAIM]

                if (typeof roles === 'string') {
                    roles = [roles]
                }

                if (expirationSeconds === undefined || displayName === undefined || roles === undefined) {
                    this.clear()
                    return
                }

                sessionStorage.setItem(this.encodedTokenName, encodedToken)
                sessionStorage.setItem(this.expirationName, expirationSeconds.toString())
                sessionStorage.setItem(this.displayNameName, displayName)
                sessionStorage.setItem(JWT_ROLE_CLAIM, JSON.stringify(roles))

                return
            }

            this.clear()
        }
        catch (_: unknown) {
            this.clear()
        }
    }

    public clear(): void {
        sessionStorage.removeItem(this.encodedTokenName)
        sessionStorage.removeItem(this.expirationName)
        sessionStorage.removeItem(this.displayNameName)
        sessionStorage.removeItem(JWT_ROLE_CLAIM)
    }
}
