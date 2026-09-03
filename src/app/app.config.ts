import { ApplicationConfig, ErrorHandler, inject } from '@angular/core';
import { provideRouter, withNavigationErrorHandler } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors, withXhr } from '@angular/common/http';
import { authInterceptor } from '../services/AuthInterceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { pleaseWaitInterceptor } from '../services/PleaseWaitInterceptor';
import { ErrorBoundaryService, GlobalErrorHandler } from '../services/ErrorBoundary';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(
            routes,
            withNavigationErrorHandler(error => inject(ErrorBoundaryService).capture(error.error)),
        ),
        provideHttpClient(withXhr(), withInterceptors([pleaseWaitInterceptor, authInterceptor])),
        provideAnimations(),
        {provide: ErrorHandler, useClass: GlobalErrorHandler},
    ]
};
