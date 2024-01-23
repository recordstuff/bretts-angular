export interface UserCredentials {
    Email: string
    Password: string
}

export const defaultUserCredentials = () : UserCredentials =>
{
    return {
        Email: "",
        Password: ""
    }
}