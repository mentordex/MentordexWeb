import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from "@angular/router";
import { filter } from 'rxjs/operators';

import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class TitleService {


  constructor(private titleService: Title, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {

  }
  setTitle() {    
  
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
    )
    .subscribe(() => {

      var rt = this.getChild(this.activatedRoute)

      rt.data.subscribe(data => {
      
        this.titleService.setTitle(data.title)})
    })
  }

  getChild(activatedRoute: ActivatedRoute) {
    if (activatedRoute.firstChild) {
      return this.getChild(activatedRoute.firstChild);
    } else {
      return activatedRoute;
    }
 
  }
  
}
