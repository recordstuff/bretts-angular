export const JWT_ROLE_CLAIM = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'

export interface Jwt {
    sub: string
    jti: string
    displayName: string
    exp: number
    iss: string
    aud: string
    [JWT_ROLE_CLAIM]: string | string[]
}

export enum JwtRole {
    Any = 'Any',
    Admin = 'Admin',
    User = 'User',
}
