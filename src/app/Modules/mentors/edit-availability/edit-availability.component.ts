import { Component, OnInit, OnDestroy, ViewChild, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, ValidationErrors, FormControl, FormArray, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { MovingDirection, WizardComponent } from 'angular-archwizard';

// import fade in animation
import { fadeInAnimation } from '../../../core/animations';
import { AuthService, UtilsService } from '../../../core/services';

//import enviornment
import { environment } from '../../../../environments/environment';

//import custom validators
import { CustomValidators } from '../../../core/custom-validators';

import { NgxUiLoaderService } from 'ngx-ui-loader';

export const minLengthArray = (min: number) => {
  return (c: AbstractControl): { [key: string]: any } => {
    if (c.value.length >= min)
      return null;

    return { MinLengthArray: true };
  }
}

@Component({
  selector: 'app-edit-availability',
  templateUrl: './edit-availability.component.html',
  styleUrls: ['./edit-availability.component.css']
})
export class EditAvailabilityComponent implements OnInit {

  private onDestroy$: Subject<void> = new Subject<void>();
  hourlyRateForm: FormGroup;
  id: any = '';
  mentorProfileDetails: any = {};
  isHourlyRateFormSubmitted: boolean = false
  minDate: Date;
  maxDate: Date;
  getCurrentDay: any = '';
  getCurrentDate: any = '';
  getSelectedDate: any = '';

  slots: any = [];
  selectedAvailabilityArray: any = [];
  selectedSlotsArray: any = [];
  selectedSlot: boolean = false;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private utilsService: UtilsService, private router: Router, private activatedRoute: ActivatedRoute, private ngxLoader: NgxUiLoaderService) {
    this.minDate = new Date();
    this.maxDate = new Date();
    this.minDate.setDate(this.minDate.getDate());
    this.getCurrentDay = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][new Date().getDay()]
    this.getCurrentDate = ("0" + (this.minDate.getMonth() + 1)).slice(-2) + '/' + (this.minDate.getDate()) + '/' + this.minDate.getFullYear();
    this.getSelectedDate = this.getCurrentDate;
  }

  ngOnInit(): void {
    this.initalizeHourlyRateForm();
    this.initalizeTimeSlots();
    this.checkQueryParam();
  }

  private checkQueryParam() {
    this.id = localStorage.getItem('x-user-ID');
    this.getMentorProfileDetailsByToken(this.id);

    this.hourlyRateForm.patchValue({
      userID: this.id
    });

  }

  /**
   * get Mentor Details By Token
  */
  getMentorProfileDetailsByToken(id): void {
    this.utilsService.processPostRequest('getMentorProfileDetails', { userID: this.id }, true).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      this.mentorProfileDetails = response;
      //console.log(this.mentorProfileDetails); return;

      if (this.mentorProfileDetails.availability.length > 0) {
        this.mentorProfileDetails.availability.forEach((element, index, availabilityArray) => {
          this.availability().push(new FormControl({
            date: element.date,
            slots: element.slots
          }))

          this.selectedAvailabilityArray.push({
            date: element.date,
            slots: element.slots
          })
        })
      }


      this.hourlyRateForm.patchValue({
        hourly_rate: this.mentorProfileDetails.hourly_rate,
      });


    })
  }

  //initalize Academic History form
  private initalizeHourlyRateForm() {
    this.hourlyRateForm = this.formBuilder.group({
      userID: [''],
      hourly_rate: [''],
      availability: this.formBuilder.array([])
    });
  }

  onCheckboxChange(e) {
    //const slots: FormArray = this.availability().get('slots') as FormArray;
    if (e.target.checked) {
      //slots.push(new FormControl({ value: e.target.value, isChecked: true }));
      this.selectedSlotsArray.push({ value: e.target.value, isChecked: true });
    } else {
      

      this.selectedSlotsArray = this.selectedSlotsArray.filter(function (item) {
        return item.value !== e.target.value;
      });
    }

    //console.log(slots);
  }

  /**
  * on Submit Employment History
 */
  onSubmitHourlyRateForm() {
    if (this.hourlyRateForm.invalid) {
      this.isHourlyRateFormSubmitted = true
      return false;
    }
    //console.log(this.hourlyRateForm.value); return;

    this.utilsService.processPostRequest('updateProfileHourlyRateDetails', this.hourlyRateForm.value, true, '').pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      //console.log(response);
      this.checkQueryParam();
      this.utilsService.onResponse('Your availability updated successfully.', true);
    })
  }

  availability(): FormArray {
    return this.hourlyRateForm.get("availability") as FormArray
  }

  newAvailability(): FormGroup {
    return this.formBuilder.group({
      date: [''],
      slots: this.formBuilder.array([])
    })
  }

  addAvailability() {
    this.availability().push(this.newAvailability());
  }

  initalizeTimeSlots() {
    for (var i = 0; i < 12; i++) {
      var amTimeFormat = 'AM';
      var pmTimeFormat = 'PM';
      i = (i < 9) ? parseInt(`0${i}`) : i;


      if (i < 9) {
        var j = (i == 0) ? '12' : `0${i}`
        this.slots.push({ slot: `${j}:00 ${amTimeFormat} - 0${i + 1}:00 ${amTimeFormat}`, isChecked: false })
      } else if (i == 9) {
        this.slots.push({ slot: `0${i}:00 ${amTimeFormat} - ${i + 1}:00 ${amTimeFormat}`, isChecked: false })
      } else {
        if (i >= 11) {
          this.slots.push({ slot: `${i}:00 ${amTimeFormat} - ${i + 1}:00 ${pmTimeFormat}`, isChecked: false })
        } else {
          this.slots.push({ slot: `${i}:00 ${amTimeFormat} - ${i + 1}:00 ${amTimeFormat}`, isChecked: false })
        }

      }

    }

    for (var i = 0; i < 12; i++) {
      var amTimeFormat = 'AM';
      var pmTimeFormat = 'PM';
      i = (i < 9) ? parseInt(`0${i}`) : i;


      if (i < 9) {
        var j = (i == 0) ? '12' : `0${i}`
        this.slots.push({ slot: `${j}:00 ${pmTimeFormat} - 0${i + 1}:00 ${pmTimeFormat}`, isChecked: false })
      } else if (i == 9) {
        this.slots.push({ slot: `0${i}:00 ${pmTimeFormat} - ${i + 1}:00 ${pmTimeFormat}`, isChecked: false })
      } else {
        if (i >= 11) {
          this.slots.push({ slot: `${i}:00 ${pmTimeFormat} - ${i + 1}:00 ${amTimeFormat}`, isChecked: false })
        } else {
          this.slots.push({ slot: `${i}:00 ${pmTimeFormat} - ${i + 1}:00 ${pmTimeFormat}`, isChecked: false })
        }

      }

    }

    //console.log(this.slots);

  }

  onDateChange(value: Date): void {
    let selectedDate = new Date(value);
    let formatDate = ("0" + (selectedDate.getMonth() + 1)).slice(-2) + '/' + selectedDate.getDate() + '/' + selectedDate.getFullYear();
    this.getSelectedDate = formatDate;
    //this.hourlyRateForm.controls.availability.get('date').patchValue(formatDate);
  }

  onSubmitSaveAndAddMore(): void {
    if (this.selectedSlotsArray.length > 0) {
      let found = this.selectedAvailabilityArray.some(el => el.date === this.getSelectedDate);
      if (!found) {
        this.availability().push(new FormControl({
          date: this.getSelectedDate,
          slots: this.selectedSlotsArray
        }))

        this.selectedAvailabilityArray.push({
          date: this.getSelectedDate,
          slots: this.selectedSlotsArray
        })

        this.slots = [];
        this.initalizeTimeSlots();
        this.selectedSlotsArray = [];

      } else {

        //console.log('hello')
        //console.log(this.getSelectedDate)
        //console.log(this.selectedAvailabilityArray);


        let selectedDate = this.getSelectedDate;

        let i: number = 0;
        this.availability().controls.forEach((item: FormControl) => {
          //console.log(item);
          if (item.value.date == this.getSelectedDate) {
            this.availability().removeAt(i);
            return;
          }
          i++;
        });

        this.selectedAvailabilityArray = this.selectedAvailabilityArray.filter(function (item) {
          //console.log(item);
          //console.log(this.getSelectedDate);
          return item.date !== selectedDate;
        });


        this.availability().push(new FormControl({
          date: this.getSelectedDate,
          slots: this.selectedSlotsArray
        }))

        this.selectedAvailabilityArray.push({
          date: this.getSelectedDate,
          slots: this.selectedSlotsArray
        })
        this.slots = [];
        this.initalizeTimeSlots();

        this.selectedSlotsArray = [];


      }


    }
    //console.log(this.availability().value);
    //console.log(this.selectedAvailabilityArray);
  }

  /**
* set check object array length.
* @param object
*  @return number
*/
  public checkObjectLength(object): number {
    return Object.keys(object).length;
  }

  //destroy all subscription
  public ngOnDestroy(): void {
    this.onDestroy$.next();
  }

}
