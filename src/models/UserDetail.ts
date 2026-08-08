import { NameGuidPair } from './NameGuidPair'
import { UserSummary } from './UserSummary'

export interface UserDetail extends UserSummary {
    Phone: string | null
    Roles: NameGuidPair[]
}

export const emptyUserDetail = (): UserDetail => ({
    Guid: '00000000-0000-0000-0000-000000000000',
    Email: '',
    DisplayName: '',
    Phone: '',
    Roles: [],
})
