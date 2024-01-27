import { Routes, mapToCanActivate } from '@angular/router';
import { LoginComponent } from '../pages/login/login.component';
import { HomeComponent } from '../pages/home/home.component';
import { AuthGuard } from '../components/AuthGuard';

export const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: mapToCanActivate([AuthGuard]), },
    { path: 'login', component: LoginComponent },
];
