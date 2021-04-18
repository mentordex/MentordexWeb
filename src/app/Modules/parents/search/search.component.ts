import { Component, OnInit, OnDestroy, ViewEncapsulation  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AuthService, UtilsService } from '../../../core/services';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  private onDestroy$: Subject<void> = new Subject<void>();
  rating=''
  hourlyRate = ''
  location = ''
  categories:any = []
  subcategories:any=[]
  results:any = []
  pagination:any = {
    search:'',
    sort_by:'created_at',
    sort_dir:'desc',
    filters:[],
    size:5,
    pageNumber:1,   
  }
  searchForm: FormGroup;
  totalRecords:Number=0
  isLoading:boolean = false

  filters:any = []
  filterWithKeyValue = {}
  currentDate:Date = new Date();
  rangeValue: { from: Date; to: Date } = {
    from: new Date(),
    to: (new Date() as any)
  };

  constructor(private utilsService: UtilsService, private formBuilder:FormBuilder,) { }

  ngOnInit(): void {
    this.searchForm=this.formBuilder.group({    
      search: [null, [Validators.required]]
    })
    this.fetchCategories() 
    this.fetchResults()   
  }

  fetchCategories() {
    
    this.utilsService.processGetRequest('category/listing').pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      this.categories = response
    })
  }
  fetchSubcategories(category) {
    let index = this.filters.findIndex(x => x.filter=="category");   
    if(index!=-1){
      this.filters[index] = {filter:'category',id:category._id,name:category.title}
      this.filterWithKeyValue['category'] = category._id
    }else{      
      this.filters.push({filter:'category',id:category._id,name:category.title})
      this.filterWithKeyValue['category'] = category._id
    }
    let subcategoryIndex = this.filters.findIndex(x => x.filter=="subcategory"); 
    if(subcategoryIndex != -1)
      (this.filters).splice(index, 1);

    this.utilsService.processPostRequest('subcategoryListing',{category_id:category._id},true, '').pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      this.subcategories = response
    })

    this.pagination.filters = this.filters 
    this.fetchResults()
  }

  fetchResults() {
    this.isLoading = true
    this.pagination['filters'] = this.filterWithKeyValue
    console.log('filters',this.pagination);
    this.utilsService.processPostRequest('search',this.pagination,true, '').pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      this.results = response['records']
      this.totalRecords = response['total_records']
      this.isLoading = false
    })
  }

  onSearch(){
    var searchValue = (this.searchForm.get('search').value).trim()
    if (this.searchForm.invalid || !searchValue) {     
      return false;      
    }
    let index = this.filters.findIndex(x => x.filter=="search");   
      if(index!=-1){
        this.filters[index] = {filter:'search',id:'',name:this.searchForm.get('search').value}
        this.filterWithKeyValue['search'] = this.searchForm.get('search').value
      }else{      
        this.filters.push({filter:'search',id:'',name:this.searchForm.get('search').value})
        this.filterWithKeyValue['search'] = this.searchForm.get('search').value
      }

    this.pagination['search'] = this.searchForm.get('search').value 
    this.fetchResults()
  }
  sortRecords(event){
    if(event.target.value){
      let sortOption = (event.target.value).split(",");
      this.pagination['sort_by'] = sortOption[0]
      this.pagination['sort_dir'] = sortOption[1] 
    }else{
      this.pagination['sort_by'] = 'created_at'
      this.pagination['sort_dir'] = 'desc'
    }
    console.log('pagination',this.pagination)
    this.fetchResults()
  }

  nextpage(page){
    this.pagination.pageNumber = page 
    this.fetchResults()
  }
  

  applySearch(){
    console.log('location',this.location)
    if(this.location.length>0){

      let index = this.filters.findIndex(x => x.filter=="location");   
      if(index!=-1){
        this.filters[index] = {filter:'location',id:'',name:this.location}
        this.filterWithKeyValue['location'] = this.location
      }else{      
        this.filters.push({filter:'location',id:'',name:this.location})
        this.filterWithKeyValue['location'] = this.location
      }

      this.fetchResults()
    }
  }
  setLocation(eventObj,type){
    
      eventObj = eventObj.trim()
      if(eventObj.length<=0)
        return false
    

      this.location=eventObj
      let index = this.filters.findIndex(x => x.filter=="location");   
      if(index!=-1){
        this.filters[index] = {filter:'location',id:'',name:eventObj}
        this.filterWithKeyValue['location'] = eventObj
      }else{      
        this.filters.push({filter:'location',id:'',name:eventObj})
        this.filterWithKeyValue['location'] = eventObj
      }
  }
  filterRecords(eventObj,type){
    if(type=='location'){
      eventObj = eventObj.trim()
      if(eventObj.length<=0)
      return false
    }
    

    if(type=='subcategory'){
      let index = this.filters.findIndex(x => x.filter=="subcategory");   
      if(index!=-1){
        this.filters[index] = {filter:'subcategory',id:eventObj._id,name:eventObj.title}
        this.filterWithKeyValue['subcategory'] = eventObj._id
      }else{      
        this.filters.push({filter:'subcategory',id:eventObj._id,name:eventObj.title})
        this.filterWithKeyValue['subcategory'] = eventObj._id
      }
    }else if(type=='rating'){
      let index = this.filters.findIndex(x => x.filter=="rating");   
      if(index!=-1){
        this.filters[index] = {filter:'rating',id:'',name:(eventObj!='Any')?eventObj+' & up':eventObj}
        this.filterWithKeyValue['rating'] = (eventObj!='Any')?parseInt(eventObj):eventObj
        console.log('type', typeof eventObj)
        this.rating = eventObj
      }else{      
        this.filters.push({filter:'rating',id:'',name:(eventObj!='Any')?eventObj+' & up':eventObj})
        this.filterWithKeyValue['rating'] = (eventObj!='Any')?parseInt(eventObj):eventObj
        this.rating = eventObj
      }
    }else if(type=='location'){
      this.location=eventObj
      let index = this.filters.findIndex(x => x.filter=="location");   
      if(index!=-1){
        this.filters[index] = {filter:'location',id:'',name:eventObj}
        this.filterWithKeyValue['location'] = eventObj
      }else{      
        this.filters.push({filter:'location',id:'',name:eventObj})
        this.filterWithKeyValue['location'] = eventObj
      }
    }
    this.fetchResults()

  }

  filterByHourlyRate(title, min,max){
    let index = this.filters.findIndex(x => x.filter=="hourly_rate");
    
      if(index!=-1){
        
        if(title=='Any'){
          this.removeFilter(index, 'hourly_rate')
          this.filters[index] = {filter:'hourly_rate',id:'',name:title}
        }else{
          this.filterWithKeyValue['hourly_rate'] = {min:min?min:0,max:max?max:0}
        }
          
      }else{      
       
        if(title=='Any'){
          this.removeFilter(index, 'hourly_rate')
          this.filters.push({filter:'hourly_rate',id:'',name:title})
        }else{
          this.filters.push({filter:'hourly_rate',id:'',name:title})
          this.filterWithKeyValue['hourly_rate'] = {min,max}
        }
          
      }
      this.hourlyRate =   title 
      this.fetchResults()
  }

  
  removeFilter(index, type){
    (this.filters).splice(index, 1);
    delete this.filterWithKeyValue[type]

    
    if(type=='category'){
      this.subcategories = []
    }
    if(type=='search'){
      this.pagination.search = ''
      this.searchForm.patchValue({search:''})
    }
    if(type=='rating'){
      this.rating = ''
    }
    if(type=='hourly_rate'){
      this.hourlyRate = ''
    }
    if(type=='location'){
      this.location = ''
    }
    
      
    this.fetchResults()
  }

  clearFilters(){
    this.filters = []
    this.filterWithKeyValue = {}
    this.subcategories = []
    this.pagination.search = ''
    this.searchForm.patchValue({search:''})
    this.rating = ''
    this.hourlyRate = ''
    this.location=''
    this.fetchResults()
  }

}

