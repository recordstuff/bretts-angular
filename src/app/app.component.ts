import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ErrorBoundaryComponent } from '../components/ErrorBoundary';
import { PleaseWaitComponent } from '../components/PleaseWait';

@Component({
    selector: 'app-root',
    imports: [ErrorBoundaryComponent, PleaseWaitComponent, RouterOutlet],
    templateUrl: 'app.component.html',
    styleUrl: './app.component.scss'
})

export class AppComponent { }
