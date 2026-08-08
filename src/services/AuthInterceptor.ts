import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../environments/environment';
import { JwtUtil } from './JwtUtil';

const ABSOLUTE_URL = /^[a-z][a-z\d+.-]*:\/\//i;

const apiUrl = (path: string): string =>
    `${environment.apiUrl.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;

export const authInterceptor: HttpInterceptorFn = (request, next) => {
    if (ABSOLUTE_URL.test(request.url)) {
        return next(request);
    }

    const token = inject(JwtUtil).token;
    const setHeaders: Record<string, string> = {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    };

    if (token.length > 0) {
        setHeaders['Authorization'] = `Bearer ${token}`;
    }

    return next(request.clone({
        setHeaders,
        url: apiUrl(request.url),
        withCredentials: true,
    }));
};
