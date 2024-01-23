export interface Jwt {
    sub: string
    jti: string
    displayName: string
    exp: number
    iss: string
    aud: string
}