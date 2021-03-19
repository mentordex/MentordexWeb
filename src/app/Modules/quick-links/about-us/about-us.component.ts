import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from "@angular/router";
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// import fade in animation
import { AuthService, UtilsService } from '../../../core/services';

//import enviornment
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit {
  private onDestroy$: Subject<void> = new Subject<void>();
  aboutUs:any = []
  constructor( private utilsService: UtilsService) {  }

  ngOnInit(): void {
    this.fetchAbout();
  }

  fetchAbout() {
    this.utilsService.processGetRequest('about/getAboutPage').pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      this.aboutUs = response
      console.log( this.aboutUs);
    })
  }

  //destroy all subscription
  public ngOnDestroy(): void {
    this.onDestroy$.next();
  }

}
