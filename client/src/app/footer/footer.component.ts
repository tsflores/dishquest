import { Component, type OnInit } from '@angular/core';

// simple footer component that will go on each page
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  standalone: true
})

export class FooterComponent implements OnInit {
  ngOnInit(): void {}
}
