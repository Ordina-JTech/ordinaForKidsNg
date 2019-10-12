import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(private router: Router, 
    private authenticationService : AuthenticationService,
  ) { }
  username: string;
  password: string;
    ngOnInit() {

      this.authenticationService.currentUser.subscribe(user => {
        if(user) { 
          this.router.navigate(["calendar"])
        }
      })

    }
    login(){
      
      return this.authenticationService.login(this.username, this.password);

    }
   
  }

