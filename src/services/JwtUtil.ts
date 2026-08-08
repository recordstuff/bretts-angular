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

        return !Number.isFinite(expireSeconds) || expireSeconds <= Date.now() / 1000
    }

    public get token(): string {
        return sessionStorage.getItem(this.encodedTokenName) ?? ''
    }

    public set token(encodedToken: string) {
        try {
            if (encodedToken.length > 0) {
                const parts = encodedToken.split('.')
                const body = parts[1]
                    .replace(/-/g, '+')
                    .replace(/_/g, '/')
                    .padEnd(Math.ceil(parts[1].length / 4) * 4, '=')

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
