export interface UserCredentials {
    Email: string
    Password: string
}

export const defaultUserCredentials = () : UserCredentials =>
{
    return {
        Email: "adminanduser@brettdrake.org",
        Password: "test123"
    }
}

export const adminOnlyUserCredentials = () : UserCredentials =>
{
    return {
        Email: "adminonly@brettdrake.org",
        Password: "test123"
    }
}

export const userOnlyUserCredentials = () : UserCredentials =>
{
    return {
        Email: "useronly@brettdrake.org",
        Password: "test123"
    }
}
