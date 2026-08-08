import { isPlatformBrowser } from "@angular/common"
import { Inject, Injectable, PLATFORM_ID } from "@angular/core"
import { Jwt } from "../models/Jwt"

@Injectable({providedIn: 'root'})
export class JwtUtil {
    private readonly encodedTokenName: string = "accessToken"
    private readonly expirationName: string = "accessTokenExpiration"
    
    constructor(@Inject(PLATFORM_ID) private readonly platformId: object) { }

    private get storage(): Storage | null {
        return isPlatformBrowser(this.platformId) ? localStorage : null
    }

    public get isExpired() : boolean {
        const expireSecondsStr = this.storage?.getItem(this.expirationName)

        if (expireSecondsStr == null) return true

        const expireSeconds = Number.parseInt(expireSecondsStr, 10)

        return !Number.isFinite(expireSeconds) || expireSeconds <= Date.now() / 1000
    }

    public get token(): string {
        return this.storage?.getItem(this.encodedTokenName) ?? ''
    }

    public set token(encodedToken: string) {
        const storage = this.storage

        if (storage === null) return

        try {
            if (encodedToken.length > 0) {
                const parts = encodedToken.split('.')
                const body = parts[1]
                    .replace(/-/g, '+')
                    .replace(/_/g, '/')
                    .padEnd(Math.ceil(parts[1].length / 4) * 4, '=')

                const jwt: Jwt = JSON.parse(atob(body))

                storage.setItem(this.encodedTokenName, encodedToken)
                storage.setItem(this.expirationName, jwt.exp.toString())

                return
            }

            this.clear()
        }
        catch (_: unknown) {
            this.clear()
        }
    }

    public clear(): void {
        this.storage?.removeItem(this.encodedTokenName)
        this.storage?.removeItem(this.expirationName)
    }
}
