import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'
import { Component, inject, signal } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { MatButtonModule } from '@angular/material/button'
import { MatDividerModule } from '@angular/material/divider'
import { MatIconModule } from '@angular/material/icon'
import { MatListModule } from '@angular/material/list'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatToolbarModule } from '@angular/material/toolbar'
import { IsActiveMatchOptions, Router, RouterLink, RouterOutlet } from '@angular/router'
import { map } from 'rxjs'
import { DrawerMenuItem, MenuOption } from '../models/MenuOption'
import { JwtRole } from '../models/Jwt'
import { AppStateService } from '../services/AppState'
import { JwtUtil } from '../services/JwtUtil'
import { BreadcrumbinatorComponent } from './Breadcruminator'

const exactRouteMatchOptions: IsActiveMatchOptions = {
    paths: 'exact',
    queryParams: 'ignored',
    matrixParams: 'ignored',
    fragment: 'ignored',
}

const editorRouteMatchOptions: IsActiveMatchOptions = {
    ...exactRouteMatchOptions,
    paths: 'subset',
}

const menuItems: DrawerMenuItem[] = [
    {
        kind: 'option', text: 'Home', route: '/', icon: 'home', role: JwtRole.Any,
        breadcrumb: {title: 'Home', url: '/'},
    },
    {
        kind: 'option', text: 'Grid Example', route: '/gridexample', icon: 'table_rows', role: JwtRole.User,
        breadcrumb: {title: 'Grid Example', url: '/gridexample'},
    },
    {
        kind: 'option', text: 'Example Two', route: '/exampletwo', icon: 'table_chart', role: JwtRole.User,
        breadcrumb: {title: 'Example Two', url: '/exampletwo'},
    },
    {
        kind: 'option', text: 'Bacon Ipsum', route: '/baconipsum', icon: 'agriculture', role: JwtRole.User,
        breadcrumb: {title: 'Bacon Ipsum', url: '/baconipsum'},
    },
    { kind: 'divider' },
    {
        kind: 'option', text: 'Users', route: '/users', icon: 'people', role: JwtRole.Admin,
        editorRoute: '/user',
        breadcrumb: {title: 'Users', url: '/users'},
    },
    {
        kind: 'option', text: 'Roles', route: '/roles', icon: 'admin_panel_settings', role: JwtRole.Admin,
        editorRoute: '/role',
        breadcrumb: {title: 'Roles', url: '/roles'},
    },
    {
        kind: 'option', text: 'Settings', route: '/settings', icon: 'settings', role: JwtRole.Admin,
        breadcrumb: {title: 'Settings', url: '/settings'},
    },
]

@Component({
    selector: 'app-left-drawer',
    standalone: true,
    imports: [
        BreadcrumbinatorComponent,
        MatButtonModule,
        MatDividerModule,
        MatIconModule,
        MatListModule,
        MatSidenavModule,
        MatToolbarModule,
        RouterLink,
        RouterOutlet,
    ],
    templateUrl: 'LeftDrawer.html',
    styleUrl: 'LeftDrawer.scss',
})
export class LeftDrawerComponent {
    private readonly breakpointObserver = inject(BreakpointObserver)
    private readonly router = inject(Router)
    private readonly jwtUtil = inject(JwtUtil)

    readonly appState = inject(AppStateService)
    readonly isMobile = toSignal(
        this.breakpointObserver.observe(Breakpoints.XSmall).pipe(map(result => result.matches)),
        { initialValue: this.breakpointObserver.isMatched(Breakpoints.XSmall) },
    )
    readonly mobileOpen = signal(false)
    readonly showRestoredFocus = signal(false)
    readonly displayName = this.jwtUtil.displayName
    readonly visibleMenuItems = menuItems.filter(menuItem => {
        if (menuItem.kind === 'divider') {
            return this.jwtUtil.hasMultipleRoles()
        }

        return this.jwtUtil.hasRole(menuItem.role)
    })

    pointerInteraction(): void {
        this.showRestoredFocus.set(false)
    }

    keyboardInteraction(): void {
        this.showRestoredFocus.set(true)
    }

    toggleMobileMenu(): void {
        this.mobileOpen.update(isOpen => !isOpen)
    }

    closeMobileMenu(): void {
        this.mobileOpen.set(false)
    }

    menuOptionIsActive(menuOption: MenuOption): boolean {
        if (this.router.isActive(menuOption.route, exactRouteMatchOptions)) {
            return true
        }

        if (menuOption.editorRoute === undefined) {
            return false
        }

        return this.router.isActive(menuOption.editorRoute, editorRouteMatchOptions)
    }

    menuOptionSelected(menuOption: MenuOption): void {
        this.appState.firstBreadcrumb(menuOption.breadcrumb)

        if (this.isMobile()) {
            this.closeMobileMenu()
        }
    }
}
