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


    //Load External JS
    this.loadScript('../assets/js/jquery.3.5.1.min.js');
    this.loadScript('../assets/js/popper.min.js');
    this.loadScript('../assets/js/bootstrap.min.js');
    this.loadScript('../assets/js/gsap-3.5.0.min.js');
    this.loadScript('../assets/js/gsap-scollTrigger-3.5.0.min.js');
    this.loadScript('../assets/js/slick-slider.js');
    this.loadScript('../assets/js/tilt.js');
    this.loadScript('../assets/js/main.js');
    
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

  public loadScript(url: string) {
    const body = <HTMLDivElement> document.body;
    const script = document.createElement('script');
    script.innerHTML = '';
    script.src = url;
    script.async = false;
    script.defer = true;
    body.appendChild(script);
  }
}
