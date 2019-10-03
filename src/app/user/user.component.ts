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

  users:UserProfile[] = [];
  editMode: boolean = false;
  existingUser: UserProfile;

  userProfile:UserProfile = new Object();

  constructor(private authenticationService:AuthenticationService) { }

  ngOnInit() {
    this.loadUsers();
  }

  create() {
    this.authenticationService.createUser(this.userProfile).subscribe((userProfile:UserProfile) => {
      const options:SweetAlertOptions = new Object();
      options.title = "Created user";
      options.text = userProfile.firstname + " has been added to system as '" + userProfile.userrole + "'";
      options.animation = true;
      options.type = "success";
      swal.fire(options);
      this.loadUsers();
    })
    
  }

  setUser({value}) {
    this.userProfile = this.users.find(user => user.email === value);
    this.editMode = true;
    
  }

  delete() {
    swal.fire({
      title: "Are you sure",
      text: "Are you sure you want to remove this user, this will also delete all reserverations from this user",
      type: "warning",
      showCancelButton: true
    }).then(response=>{
      if(response.value) {
        this.authenticationService.deleteUser(this.userProfile).subscribe(()=>{
          swal.fire({
            title: "Success",
            text: `${this.userProfile.firstname} has been removed`,
            type: "success",
          })
        })
        this.loadUsers();
      }
    })
  }

  toNewUserMode() {
    this.userProfile = new Object();
    this.editMode = false;
    this.existingUser = new Object();
  }

  set() {
    this.authenticationService.setUser(this.userProfile).subscribe(()=>{
      swal.fire({
        title: "Saved",
        text: `${this.userProfile.firstname} has been saved`,
        type: "success",
        animation: false
      })
      this.loadUsers();
    })
  }

  private loadUsers() {
    this.authenticationService.getUsers().subscribe((users:UserProfile[]) => {
      this.users = users;
    })
  }

}
