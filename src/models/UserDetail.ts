import { NameGuidPair } from './NameGuidPair'
import { UserSummary } from './UserSummary'

export interface UserDetail extends UserSummary {
    Phone: string | null
    Roles: NameGuidPair[]
}
