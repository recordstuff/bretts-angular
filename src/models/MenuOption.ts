import { JwtRole } from './Jwt'

export interface MenuOption {
    kind: 'option'
    text: string
    route: string
    icon: string
    role: JwtRole
}

export interface MenuDivider {
    kind: 'divider'
}

export type DrawerMenuItem = MenuOption | MenuDivider
