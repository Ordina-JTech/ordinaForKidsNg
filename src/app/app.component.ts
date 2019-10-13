import { Component, isDevMode } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';
import { User } from './model/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ordinaForKids';
  loggedIn = false;
  navLinks = [];
  constructor(private authenticationService: AuthenticationService, private router: Router) {

    this.authenticationService.currentUser.subscribe(newUser => {
      this.loadMenu(newUser)
    })

  }

  loadMenu(user: User) {

    this.navLinks = [];

    if (user) {
      // any user that's logged in:
      this.navLinks.push({ path: 'calendar', label: 'Calendar' })
      this.loggedIn = true;

      // admin role
      if (user.role === 'Administrator') {
        this.navLinks.push({ path: 'user', label: 'User accounts' })
        this.navLinks.push({ path: 'report', label: 'Report' })
      }

      // ordina employee role
      if (user.role === 'OrdinaEmployee') {
        this.navLinks.push({ path: 'report', label: 'Report' })
      }

    }
    else {
      this.loggedIn = false;
      this.navLinks.push(
        { path: 'login', label: 'Login' },
      );
    }
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['login']);
  }

  ngOnInit() {
    if (isDevMode()) {
      this.authenticationService.login("admin", "admin");
    } else {
      this.logout();
    }

    this.loadMenu(this.authenticationService.currentUserValue);
  }

}
