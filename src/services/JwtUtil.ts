import { Injectable } from "@angular/core"
import { Jwt } from "../models/Jwt"

@Injectable({providedIn: 'root'})
export class JwtUtil {
    private readonly encodedTokenName: string = "accessToken"
    private readonly expirationName: string = "accessTokenExpiration"
    
    public get isExpired() : boolean {
        const expireSecondsStr = sessionStorage.getItem(this.expirationName)

        if (expireSecondsStr == null) return true

        const expireSeconds = Number.parseInt(expireSecondsStr, 10)

        return expireSeconds <= Date.now() / 1000
    }

    public get token(): string {
        return sessionStorage.getItem(this.encodedTokenName) ?? ''
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

                sessionStorage.setItem(this.encodedTokenName, encodedToken)
                sessionStorage.setItem(this.expirationName, jwt.exp.toString())

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
    }
}
