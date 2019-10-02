import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import swal, { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  roles = [
    { value: "OrdinaEmployee", viewValue: "Ordina Employee" },
    { value: "School", viewValue: "School" },
    { value: "Administrator", viewValue: "Administrator" }
  ]

  userProfile:UserProfile = new Object();

  constructor(private authenticationService:AuthenticationService) { }

  ngOnInit() {
  }

  create() {
    console.log(this.userProfile);
    this.authenticationService.createUser(this.userProfile).subscribe((userProfile:UserProfile) => {
      const options:SweetAlertOptions = new Object();
      options.title = "Created user";
      options.text = userProfile.firstname + " has been added to system as '" + userProfile.userrole + "'";
      options.animation = true;
      options.type = "success";
      swal.fire(options);
    })
  }

}
