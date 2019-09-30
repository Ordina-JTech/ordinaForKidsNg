import { Component } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ordinaForKids';

  constructor(private authenticationService: AuthenticationService) {

  }

  ngOnInit()
  {
    this.authenticationService.login("schooluser1", "school");
  }

}
