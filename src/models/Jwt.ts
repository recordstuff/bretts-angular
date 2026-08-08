export type Jwt = Record<JwtField, string | number | string[]>

export enum JwtField {
    Email = 'sub',
    Guid = 'jti',
    DisplayName = 'displayName',
    ExpirationSeconds = 'exp',
    Issuer = 'iss',
    Audience = 'aud',
    Roles = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role',
}

export enum JwtRole {
    Any = 'Any',
    Admin = 'Admin',
    User = 'User',
}
