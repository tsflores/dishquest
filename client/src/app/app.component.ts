import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// make PageHeader, Recipe, and Footer components available as children
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  standalone: true
})

export class AppComponent {

}