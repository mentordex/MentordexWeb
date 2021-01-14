import { Component, OnInit  } from '@angular/core';
import { Router, NavigationEnd  } from "@angular/router";


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isHomePage:boolean =false
  isLoginPage:boolean =false

  title='';
  constructor(private router:Router) { 

    router.events.subscribe((event) => {
     
      if (event instanceof NavigationEnd ) {
        //this.currentUrl = event.url;
        console.log(event.url)
        if(event.url =='/' || event.url =='/home' || (event.url).includes('quick-links')){
          this.isHomePage = true
        
        }else if((event.url).includes('authorization')){
         
          this.isLoginPage = true
          this.title = 'Login'
          if((event.url).includes('login'))
            this.title = 'Login'
          
          if((event.url).includes('forgot-password'))
            this.title = 'Forgot Password'

          if((event.url).includes('signup'))  
            this.title = 'Signup'
        }
      }  
        
    });



    
  }

  ngOnInit() {
   
  
   }  

}
