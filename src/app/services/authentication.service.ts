import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../model/user';
import { environment } from 'src/environments/environment';
import { RestService } from './rest.service';
import { BasicAuthInterceptor } from '../helpers/basic-auth.interceptor';


@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    
    /**
     * Current user after login has been succesful. Will be observed and triggers modifications in routing etc.
     */
    public currentUser: Observable<User>;

    /**
     * Account that will be used to make rest calls, since this account also validates itself 
     * in the rest login call it has to be set seperately from the currentUser
     */
    public restAccount: User;

    constructor(private restService: RestService) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(username: string, password: string) {
      
        // set the initial login info, this is required for the basic-auth interceptor 
        // which will add it as basic authentication for the rest call
        const user: User = new User();
        user.authdata = window.btoa(`${username}:${password}`);
        user.username = username;
        user.password = password;
        this.restAccount = user;
        

      this.restService.get("login").subscribe((userProfile:UserProfile) => {

        user.role = userProfile.userrole;
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }

    createUser(userProfile:UserProfile) {
        return this.restService.post("user", userProfile);
    }

    setUser(userProfile:UserProfile) {
        return this.restService.put("user", userProfile);
    }

    getUsers() {
        return this.restService.get("user");
    }

    deleteUser(userProfile:UserProfile) {
        return this.restService.delete("user", userProfile.email);
    }
}