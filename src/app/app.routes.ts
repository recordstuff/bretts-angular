import { Routes, mapToCanActivate } from '@angular/router';
import { LoginComponent } from '../pages/login/login.component';
import { HomeComponent } from '../pages/home/home.component';
import { AuthGuard } from '../components/AuthGuard';
import { LeftDrawerComponent } from '../components/LeftDrawer';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    {
        path: '',
        component: LeftDrawerComponent,
        canActivate: mapToCanActivate([AuthGuard]),
        children: [
            { path: '', component: HomeComponent },
            {
                path: 'gridexample',
                loadComponent: () => import('../pages/grid-example/grid-example.component').then(component => component.GridExampleComponent),
            },
            {
                path: 'exampletwo',
                loadComponent: () => import('../pages/example-two/example-two.component').then(component => component.ExampleTwoComponent),
            },
            {
                path: 'baconipsum',
                loadComponent: () => import('../pages/bacon-ipsum/bacon-ipsum.component').then(component => component.BaconIpsumComponent),
            },
            {
                path: 'users',
                loadComponent: () => import('../pages/users/users.component').then(component => component.UsersComponent),
            },
            {
                path: 'user',
                loadComponent: () => import('../pages/user/user.component').then(component => component.UserComponent),
            },
            {
                path: 'user/:id',
                loadComponent: () => import('../pages/user/user.component').then(component => component.UserComponent),
            },
            {
                path: 'roles',
                loadComponent: () => import('../pages/roles/roles.component').then(component => component.RolesComponent),
            },
            {
                path: 'role',
                loadComponent: () => import('../pages/role/role.component').then(component => component.RoleComponent),
            },
            {
                path: 'role/:id',
                loadComponent: () => import('../pages/role/role.component').then(component => component.RoleComponent),
            },
            {
                path: 'settings',
                loadComponent: () => import('../pages/settings/settings.component').then(component => component.SettingsComponent),
            },
        ],
    },
];
