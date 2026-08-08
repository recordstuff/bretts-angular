export interface Jwt {
    sub: string
    jti: string
    displayName: string
    exp: number
    iss: string
    aud: string
}

export enum JwtRole {
    Any = 'Any',
    Admin = 'Admin',
    User = 'User',
}
