import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from '../services/AuthInterceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { pleaseWaitInterceptor } from '../services/PleaseWaitInterceptor';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideHttpClient(withInterceptors([pleaseWaitInterceptor, authInterceptor])),
        provideAnimations(),
    ]
};
