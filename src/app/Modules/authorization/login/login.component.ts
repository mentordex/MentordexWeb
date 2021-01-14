import { Component, OnInit } from '@angular/core';
import { MovingDirection } from 'angular-archwizard';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  moveDirection(validityStatus, direction){
    if (direction === MovingDirection.Backwards) {
      return true;
    }
    return validityStatus;
  }

}
