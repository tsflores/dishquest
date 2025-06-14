import { Component } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { NavigationComponent } from '../navigation/navigation.component';

@Component({
  selector: 'app-about',
  imports: [FooterComponent, NavigationComponent],
  templateUrl: './about.component.html',
  standalone: true
})
export class AboutComponent {

}
