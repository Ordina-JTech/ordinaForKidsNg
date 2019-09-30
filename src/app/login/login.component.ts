import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { CalendarEventService } from '../services/calendar-event.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(private router: Router, 
    private authenticationService : AuthenticationService,
    private calendarEventService : CalendarEventService
  ) { }
  username: string;
  password: string;
    ngOnInit() {
    }
    login() : void {
      
      this.authenticationService.login(this.username, this.password);
      
      this.calendarEventService.getCalendarEvents().subscribe(() => {this.router.navigate(["calendar"])});
      

    }
   
  }

