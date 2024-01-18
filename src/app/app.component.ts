import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<h1>Hello World</h1>`,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'brett-angular';
}
