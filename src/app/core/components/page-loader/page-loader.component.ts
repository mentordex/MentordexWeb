import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PageLoaderService } from '../../services'

@Component({
  selector: 'app-page-loader',
  templateUrl: './page-loader.component.html',
  styleUrls: ['./page-loader.component.css']
})
export class PageLoaderComponent implements OnInit {
  showLoader: boolean;
  loaderText: string;
  constructor(private ref: ChangeDetectorRef, private PageLoaderService: PageLoaderService) { }

  ngOnInit() {
    this.PageLoaderService.pageLoaderStatus.subscribe((val: boolean) => {
      
      this.showLoader = val;
      console.log('showLoader',this.showLoader)
      this.ref.detectChanges();
    })
    this.PageLoaderService.getLoaderText().subscribe((text: string) => {

      this.loaderText = text;
      this.ref.detectChanges();
    })
    
  }

}
