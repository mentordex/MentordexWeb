import { Component, OnInit, OnDestroy, ViewChild, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, ValidationErrors, FormControl, FormArray, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// import fade in animation
import { fadeInAnimation } from '../../../core/animations';
import { AuthService, UtilsService } from '../../../core/services';

//import enviornment
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  private onDestroy$: Subject<void> = new Subject<void>();
  id: any = '';
  getNotificationDetails: any = []

  profileImagePath: any = 'assets/img/none.png';

  constructor(private zone: NgZone, private formBuilder: FormBuilder, private authService: AuthService, private utilsService: UtilsService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.checkQueryParam();
  }

  private checkQueryParam() {
    this.id = localStorage.getItem('x-user-ID');

    this.zone.run(() => {

      this.getNotifications(this.id);
    });

  }

  /**
   * get Mentor Notifications By Token
  */
  getNotifications(id): void {
    this.utilsService.processPostRequest('notifications/getNotifications', { userID: id }, true).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      this.getNotificationDetails = response;
      if (this.getNotificationDetails.length > 0) {
        this.getNotificationDetails.forEach((element, index, notificationArray) => {
          if ('profile_image' in element.user && element.user.profile_image.length > 0) {
            this.profileImagePath = element.user.profile_image[0].file_path;
            notificationArray[index]['profileImagePath'] = this.profileImagePath;
          } else {
            notificationArray[index]['profileImagePath'] = this.profileImagePath;
          }
        });
      }
      console.log(this.getNotificationDetails);
    })
  }

  /**
   * marked as archived
   */
  markedAsArchived(notification_id): void {

    const params = { userID: this.id, notification_id: notification_id }

    this.utilsService.processPostRequest('notifications/markedAsArchived', params, true).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      this.zone.run(() => {
        this.getNotifications(this.id);
      });
    })

  }

  //destroy all subscription
  public ngOnDestroy(): void {
    this.onDestroy$.next();
  }

}
