import { Injectable } from "@angular/core"
import { JwtField, JwtRole } from "../models/Jwt"

@Injectable({providedIn: 'root'})
export class JwtUtil {
    private readonly encodedTokenName: string = "accessToken"
    
    public get isExpired() : boolean {
        const expirationSecondsStr = sessionStorage.getItem(JwtField.ExpirationSeconds)

        if (expirationSecondsStr === null) return true

        const expirationSeconds = parseInt(expirationSecondsStr)

        return expirationSeconds <= Date.now() / 1000
    }

    public get token(): string {
        return sessionStorage.getItem(this.encodedTokenName) ?? ''
    }

    public get displayName(): string {
        return sessionStorage.getItem(JwtField.DisplayName) ?? ''
    }

    public hasRole(role: JwtRole): boolean {
        if (this.isExpired) return false

        if (role === JwtRole.Any) return true

        const rolesStr = sessionStorage.getItem(JwtField.Roles)

        if (rolesStr === null) return false

        const roles: string[] = JSON.parse(rolesStr)

        return roles.indexOf(role) >= 0
    }

    public hasMultipleRoles(): boolean {
        if (this.isExpired) return false

        const rolesStr = sessionStorage.getItem(JwtField.Roles)

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

                const jwt: Record<JwtField, string | number | string[]> = JSON.parse(atob(body))

                const expirationSeconds = jwt[JwtField.ExpirationSeconds]
                const displayName = jwt[JwtField.DisplayName]
                let roles = jwt[JwtField.Roles]

                if (typeof roles === 'string') {
                    roles = [roles]
                }

                if (expirationSeconds === undefined || displayName === undefined || roles === undefined) {
                    this.clear()
                    return
                }

                sessionStorage.setItem(this.encodedTokenName, encodedToken)
                sessionStorage.setItem(JwtField.ExpirationSeconds, expirationSeconds.toString())
                sessionStorage.setItem(JwtField.DisplayName, displayName.toString())
                sessionStorage.setItem(JwtField.Roles, JSON.stringify(roles))

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
        sessionStorage.removeItem(JwtField.ExpirationSeconds)
        sessionStorage.removeItem(JwtField.DisplayName)
        sessionStorage.removeItem(JwtField.Roles)
    }
}
