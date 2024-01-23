import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

config.providers.push(provideRouter(routes))

const bootstrap = () => bootstrapApplication(AppComponent, config);

export default bootstrap;
