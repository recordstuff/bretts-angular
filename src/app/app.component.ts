import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouterOutlet, provideRouter } from '@angular/router';

import { routes } from './app.routes';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet],
    templateUrl: 'app.component.html',
    styleUrl: './app.component.scss'
})

export class AppComponent { }
