import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { Router } from '@angular/router';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { User } from '../model/user';
import { MaterialModule } from '../helpers/material.module';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

class MockAuthenticationService {
  currentUserSubject: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  currentUser: Observable<User> = this.currentUserSubject.asObservable();

  login(username, password) {

    if (username === "school" && password === "user") {
      // mock correct login
      this.currentUserSubject.next({
        username: username,
        password: password,
        role: "school"
      });
      return true;
    } else {
      // mock wrong login
      this.currentUserSubject.next(null);
      return false;
    }

  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  let mockRouter = {
    navigate: jasmine.createSpy('navigate')
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [MaterialModule,
        FormsModule,
        BrowserAnimationsModule],
      providers: [
        { provide: AuthenticationService, useClass: MockAuthenticationService },
        { provide: Router, useValue: mockRouter }
      ]
    })
      .compileComponents();
  }));



  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('test login process', () => {
    it('should login successful when provided with the correct information and navigate to the calendar', async () => {

      mockRouter.navigate.calls.reset();
      component.username = "school";
      component.password = "user";

      const loggedIn: boolean = await component.login()
      expect(loggedIn).toBe(true);

      let authenticationService: AuthenticationService = TestBed.get(AuthenticationService);

      const user = authenticationService.currentUserValue;
      expect(user.username).toBe("school");


      expect(mockRouter.navigate).toHaveBeenCalledWith(['calendar']);
    })
    it('should not login with the wrong information and stay on the login page', async () => {
      mockRouter.navigate.calls.reset();
      component.username = "school";
      component.password = "badpassword";

      const loggedIn: boolean = await component.login()
      expect(loggedIn).toBe(false);

      let authenticationService: AuthenticationService = TestBed.get(AuthenticationService);

      const user = authenticationService.currentUserValue;
      expect(user).toBe(null);

      expect(mockRouter.navigate).toHaveBeenCalledTimes(0);
    })
  })
});
