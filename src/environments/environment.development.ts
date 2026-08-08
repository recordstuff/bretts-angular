import { Environment } from './environment.model';

export const environment = {
    production: false,
    apiUrl: 'https://localhost:7217/',
} as const satisfies Environment;
