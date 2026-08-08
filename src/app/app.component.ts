import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PleaseWaitComponent } from '../components/PleaseWait';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [PleaseWaitComponent, RouterOutlet],
    templateUrl: 'app.component.html',
    styleUrl: './app.component.scss'
})

export class AppComponent { }
