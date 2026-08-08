import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'
import { Component, inject, signal } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { MatButtonModule } from '@angular/material/button'
import { MatDividerModule } from '@angular/material/divider'
import { MatIconModule } from '@angular/material/icon'
import { MatListModule } from '@angular/material/list'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatToolbarModule } from '@angular/material/toolbar'
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router'
import { map } from 'rxjs'
import { DrawerMenuItem } from '../models/MenuOption'
import { JwtRole } from '../models/Jwt'
import { AppStateService } from '../services/AppState'
import { JwtUtil } from '../services/JwtUtil'

const menuItems: DrawerMenuItem[] = [
    { kind: 'option', text: 'Home', route: '/', icon: 'home', role: JwtRole.Any },
    { kind: 'option', text: 'Grid Example', route: '/gridexample', icon: 'table_rows', role: JwtRole.User },
    { kind: 'option', text: 'Example Two', route: '/exampletwo', icon: 'table_chart', role: JwtRole.User },
    { kind: 'option', text: 'Bacon Ipsum', route: '/baconipsum', icon: 'agriculture', role: JwtRole.User },
    { kind: 'divider' },
    { kind: 'option', text: 'Users', route: '/users', icon: 'people', role: JwtRole.Admin },
    { kind: 'option', text: 'Settings', route: '/settings', icon: 'settings', role: JwtRole.Admin },
]

@Component({
    selector: 'app-left-drawer',
    standalone: true,
    imports: [
        MatButtonModule,
        MatDividerModule,
        MatIconModule,
        MatListModule,
        MatSidenavModule,
        MatToolbarModule,
        RouterLink,
        RouterLinkActive,
        RouterOutlet,
    ],
    templateUrl: 'LeftDrawer.html',
    styleUrl: 'LeftDrawer.scss',
})
export class LeftDrawerComponent {
    private readonly breakpointObserver = inject(BreakpointObserver)
    private readonly jwtUtil = inject(JwtUtil)

    readonly appState = inject(AppStateService)
    readonly isMobile = toSignal(
        this.breakpointObserver.observe(Breakpoints.XSmall).pipe(map(result => result.matches)),
        { initialValue: this.breakpointObserver.isMatched(Breakpoints.XSmall) },
    )
    readonly mobileOpen = signal(false)
    readonly displayName = this.jwtUtil.displayName
    readonly visibleMenuItems = menuItems.filter(menuItem => menuItem.kind === 'divider'
        ? this.jwtUtil.hasMultipleRoles()
        : this.jwtUtil.hasRole(menuItem.role))

    toggleMobileMenu(): void {
        this.mobileOpen.update(isOpen => !isOpen)
    }

    closeMobileMenu(): void {
        this.mobileOpen.set(false)
    }

    menuOptionSelected(): void {
        if (this.isMobile()) {
            this.closeMobileMenu()
        }
    }
}
