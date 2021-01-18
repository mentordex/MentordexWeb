import { Component, OnInit } from '@angular/core';

//import jquery and sweet alert plugin
declare var $;

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    $('.grid').masonry();
  }

}
