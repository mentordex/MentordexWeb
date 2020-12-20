import { Component } from '@angular/core';

//import title service to change the page title dynamically
import { TitleService } from './core/services'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'dexmentor';
  constructor(private titleService:TitleService) { }

  ngOnInit() { 
    this.titleService.setTitle();
  }

  onActivate(event) {
    let scrollToTop = window.setInterval(() => {
        let pos = window.pageYOffset;
        if (pos > 0) {
            window.scrollTo(0, pos - 20); // how far to scroll on each step
        } else {
            window.clearInterval(scrollToTop);
        }
    }, 16);
  }
}
