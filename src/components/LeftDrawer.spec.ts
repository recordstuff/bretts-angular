import { BreakpointObserver } from '@angular/cdk/layout'
import { TestBed } from '@angular/core/testing'
import { provideNoopAnimations } from '@angular/platform-browser/animations'
import { provideRouter } from '@angular/router'
import { of } from 'rxjs'
import { JwtRole } from '../models/Jwt'
import { JwtUtil } from '../services/JwtUtil'
import { LeftDrawerComponent } from './LeftDrawer'

describe('LeftDrawerComponent', () => {
    const visibleOptionsFor = async (roles: JwtRole[]): Promise<string[]> => {
        await TestBed.configureTestingModule({
            imports: [LeftDrawerComponent],
            providers: [
                provideNoopAnimations(),
                provideRouter([]),
                {
                    provide: BreakpointObserver,
                    useValue: {
                        isMatched: () => false,
                        observe: () => of({ matches: false, breakpoints: {} }),
                    },
                },
                {
                    provide: JwtUtil,
                    useValue: {
                        displayName: 'Sample User',
                        hasMultipleRoles: () => roles.length > 1,
                        hasRole: (role: JwtRole) => role === JwtRole.Any || roles.includes(role),
                    },
                },
            ],
        }).compileComponents()

        const fixture = TestBed.createComponent(LeftDrawerComponent)

        return fixture.componentInstance.visibleMenuItems
            .flatMap(menuItem => menuItem.kind === 'option' ? [menuItem.text] : [])
    }

    afterEach(() => TestBed.resetTestingModule())

    it('shows every option for Admin and User roles', async () => {
        expect(await visibleOptionsFor([JwtRole.Admin, JwtRole.User])).toEqual([
            'Home',
            'Grid Example',
            'Example Two',
            'Bacon Ipsum',
            'Users',
            'Settings',
        ])
    })

    it('shows only Admin options for the Admin role', async () => {
        expect(await visibleOptionsFor([JwtRole.Admin])).toEqual([
            'Home',
            'Users',
            'Settings',
        ])
    })

    it('shows only User options for the User role', async () => {
        expect(await visibleOptionsFor([JwtRole.User])).toEqual([
            'Home',
            'Grid Example',
            'Example Two',
            'Bacon Ipsum',
        ])
    })
})
