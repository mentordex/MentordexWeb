import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

//import enviornment
import { environment } from '../../../../environments/environment';


// import fade in animation
import { UtilsService } from '../../../core/services';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {

 
  private onDestroy$: Subject<void> = new Subject<void>();  
  teams:any = []
  constructor(private utilsService: UtilsService) { 
    
    
  }
  ngOnInit(): void {
    this.fetchTeams()
  }

  //fetch office listing
  fetchTeams(){
    this.utilsService.processGetRequest('team', true ).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      this.teams = response            
    })
  }

  //destroy all subscription
  public ngOnDestroy(): void {
    this.onDestroy$.next();
  }

}
