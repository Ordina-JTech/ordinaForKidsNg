import { Component } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';
import { AppRoutingModule } from './app-routing.module';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ordinaForKids';
  navLinks = [
    { path: 'login', label: 'Login' },
    { path: 'calendar', label: 'Calendar' },
  ];
  constructor(private authenticationService: AuthenticationService) {
    

  }

  ngOnInit()
  {
    //this.authenticationService.login("schooluser1", "school");
  }

}
