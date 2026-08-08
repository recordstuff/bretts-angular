import { Environment } from './environment.model';

export const environment = {
    production: true,
    apiUrl: 'https://brettdrake.org:8080/',
} as const satisfies Environment;
