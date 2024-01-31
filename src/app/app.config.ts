import { ApplicationConfig, Provider } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../services/AuthInterceptor';
import { provideAnimations } from '@angular/platform-browser/animations';

const authInterceptorProvider: Provider = {
    provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true
};

export const appConfig: ApplicationConfig = {
    providers: [
    authInterceptorProvider,
    provideClientHydration(),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations()
]
};
