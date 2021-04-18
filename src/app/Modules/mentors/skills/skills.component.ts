import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, ValidationErrors, FormControl, FormArray, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// import fade in animation
import { fadeInAnimation } from '../../../core/animations';
import { AuthService, UtilsService } from '../../../core/services';

//import custom validators
import { CustomValidators } from '../../../core/custom-validators';

//import enviornment
import { environment } from '../../../../environments/environment';

export const minLengthArray = (min: number) => {
  return (c: AbstractControl): { [key: string]: any } => {
    if (c.value.length >= min)
      return null;

    return { MinLengthArray: true };
  }
}

export const maxLengthArray = (min: number) => {
  return (c: AbstractControl): { [key: string]: any } => {
    if (c.value.length <= min)
      return null;

    return { MaxLengthArray: true };
  }
}

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})
export class SkillsComponent implements OnInit {

  private onDestroy$: Subject<void> = new Subject<void>();
  id: any = ''
  mentorDetails: any = {};
  categories: any = [];
  subcategoryArray: any = [];
  selectedSubcategoryArray: any = [];
  selectedSubcategories: any = [];
  selectedCategoryName: any = '';

  

  skillsForm: FormGroup;
  isSkillsFormSubmitted: boolean = false

  constructor(private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder, private authService: AuthService, private utilsService: UtilsService, private router: Router) { }

  ngOnInit(): void {
    this.getCategoryListing();
    this.initalizeSkillsForm();
    this.checkQueryParam();
  }

  private checkQueryParam() {
    this.id = localStorage.getItem('x-user-ID');
    this.getMentorDetailsByToken(this.id);
    this.skillsForm.patchValue({
      userID: this.id
    });
  }

  /**
   * get Mentor Details By Token
  */
  getMentorDetailsByToken(id): void {
    this.utilsService.processPostRequest('getMentorDetails', { userID: this.id }, true).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      //console.log(response);
      this.mentorDetails = response;

       if (this.mentorDetails.admin_status == 'NEW') {
        this.router.navigate(['/mentor/application-status']);
      } 
      

      const subcategories: FormArray = this.skillsForm.get('subcategories') as FormArray;
      
      this.skillsForm.patchValue({
        category_id: this.mentorDetails.category_id ? this.mentorDetails.category_id : ''
      });

      this.mentorDetails.subcategories.forEach(element => {
        subcategories.push(new FormControl(element));
      });

      if (this.mentorDetails.category_id) {
        this.utilsService.processPostRequest('subcategory/listing', { category_id: this.mentorDetails.category_id }, false).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
          this.subcategoryArray = response;
          
          this.subcategoryArray.forEach(element => {
            if(this.mentorDetails.subcategories.indexOf(element._id) > -1){
              this.selectedSubcategoryArray.push({ id: element._id, name: element.title });
            }
          });

        })
      }

    })
  }

  //initalize Basic Detailsform
  private initalizeSkillsForm() {
    this.skillsForm = this.formBuilder.group({
      userID: [''],
      category_id: ['', [Validators.required]],
      subcategories: this.formBuilder.array([], [minLengthArray(1), maxLengthArray(3)]),
      subcategory_id1: [''],
      subcategory_id2: [''],
      subcategory_id3: [''],
    });
  }

  onCheckboxChange(e) {
    const subcategories: FormArray = this.skillsForm.get('subcategories') as FormArray;

    if (e.target.checked) {
      subcategories.push(new FormControl({ value: e.target.value, name: e.target.getAttribute('data-subCategoryName') }));
      //subcategories.push(new FormControl(e.target.value));

      //console.log(e.target.getAttribute('data-subCategoryName'));
      this.selectedSubcategoryArray.push({ id: e.target.value, name: e.target.getAttribute('data-subCategoryName') });

    } else {

      let i: number = 0;
      subcategories.controls.forEach((item: FormControl) => {
        //console.log(item);
        if (item.value.value == e.target.value) {
          subcategories.removeAt(i);
          return;
        }
        i++;
      });

      this.selectedSubcategoryArray = this.selectedSubcategoryArray.filter(function (item) {
        return item.id !== e.target.value;
      });




    }

    //console.log(this.selectedSubcategoryArray);
  }

  /**
   * on Submit Basic Details
  */
  onSubmitSkillsDetailsForm() {


    

    if (this.skillsForm.invalid) {
      this.isSkillsFormSubmitted = true
      return false;
    } 

    //console.log(this.selectedSubcategoryArray[0].id);

    if(this.selectedSubcategoryArray.length == 1){
      this.skillsForm.controls.subcategory_id1.patchValue(this.selectedSubcategoryArray[0].id);
    }
    if(this.selectedSubcategoryArray.length == 2){
      this.skillsForm.controls.subcategory_id1.patchValue(this.selectedSubcategoryArray[0].id);
      this.skillsForm.controls.subcategory_id2.patchValue(this.selectedSubcategoryArray[1].id);
    }
    if(this.selectedSubcategoryArray.length == 3){
      this.skillsForm.controls.subcategory_id1.patchValue(this.selectedSubcategoryArray[0].id);
      this.skillsForm.controls.subcategory_id2.patchValue(this.selectedSubcategoryArray[1].id);;
      this.skillsForm.controls.subcategory_id3.patchValue(this.selectedSubcategoryArray[2].id);;
    }
    //console.log(this.skillsForm.value); return;
    
    this.utilsService.processPostRequest('updateSkillsDetails', this.skillsForm.value, true, '').pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      //console.log(response);
      //this.utilsService.onResponse('Your information updated successfully.', true);
      this.router.navigate(['/mentor/book-a-slot']);
    })
  }

  removeSubCategory(subCategoryId) {
    const subcategories: FormArray = this.skillsForm.get('subcategories') as FormArray;

    let i: number = 0;
    subcategories.controls.forEach((item: FormControl) => {
      //console.log(item)
      if (item.value.value == subCategoryId) {
        subcategories.removeAt(i);
        return;
      }
      i++;
    });

    this.selectedSubcategoryArray = this.selectedSubcategoryArray.filter(function (item) {
      return item.id !== subCategoryId;
    });

    //console.log(subcategories);
  }

  /**
   * get All categories
   */
  getCategoryListing() {

    this.utilsService.processGetRequest('category/listing', false).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      this.categories = response;
    })
  }

  /**
   * get All categories
   */
  getSubcategoryListing(event) {
    let categoryID = event.target.value

    this.subcategoryArray = [];
    this.selectedSubcategoryArray = [];
    const subcategories: FormArray = this.skillsForm.get('subcategories') as FormArray;
    subcategories.clear();

    if (categoryID) {

      this.selectedCategoryName = [event.target.options[event.target.selectedIndex].getAttribute('data-categoryName')];

      this.utilsService.processPostRequest('subcategory/listing', { category_id: categoryID }, false).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
        this.subcategoryArray = response;

      })
    }

  }

  checkSubcategory(id) {
    return this.selectedSubcategoryArray.some(t => t.id === id);
  }


  //destroy all subscription
  public ngOnDestroy(): void {
    this.onDestroy$.next();
  }

}
