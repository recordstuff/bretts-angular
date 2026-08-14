import { JwtRole } from './Jwt'
import { VisitedPage } from './VisitedPage'

export interface MenuOption {
    kind: 'option'
    text: string
    route: string
    editorRoute?: string
    icon: string
    role: JwtRole
    breadcrumb: VisitedPage
}

export interface MenuDivider {
    kind: 'divider'
}

export type DrawerMenuItem = MenuOption | MenuDivider
