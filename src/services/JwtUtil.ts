import { Injectable } from "@angular/core"
import { Jwt } from "../models/Jwt"

@Injectable({providedIn: 'root'})
export class JwtUtil {
    private readonly encodedTokenName: string = "accessToken"
    private readonly expirationName: string = "accessTokenExpiration"
    
    public get isExpired() : boolean {
        const expireSecondsStr = localStorage.getItem(this.expirationName)

        if (expireSecondsStr === null) return true

        const expireSeconds = parseInt(expireSecondsStr)

        return expireSeconds <= Date.now() / 1000
    }

    public get token(): string {
        return localStorage.getItem(this.encodedTokenName) ?? ''
    }

    public set token(encodedToken: string) {
        try {
            if (encodedToken.length > 0) {
                const parts = encodedToken.split('.')
                let body = parts[1].replace('-', '+').replace('_', '/')
                const padding = 4 - (body.length % 4)
    
                if (padding > 0) {
                    body = body.padEnd(padding)
                }

                const jwt: Jwt = JSON.parse(atob(body))

                localStorage.setItem(this.encodedTokenName, encodedToken)
                localStorage.setItem(this.expirationName, jwt.exp.toString())                

                return
            }

            this.clear()
        }
        catch (_: unknown) {
            this.clear()
        }
    }

    public clear(): void {
        localStorage.removeItem(this.encodedTokenName)
        localStorage.removeItem(this.expirationName)
    }
}