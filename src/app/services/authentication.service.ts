import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../model/user';
import { RestService } from './rest.service';


@Injectable({ providedIn: 'root' })
export class AuthenticationService {

    /**
     * The BehaviorSubject emits the value of the observable
     */
    private currentUserSubject: BehaviorSubject<User>;
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

    /**
     * returns the currentUserValue
     */
    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    /**
     * Method to validate the login credentials and set the currentuser if the login is successful.
     * When the login response from the server fails, the logout is triggered which wipes all login info and currentUserInfo
     * 
     * The logout() is called from the HttpInterception method that detects a 401 response and acts accordingly.
     * 
     * The login() method only sets the credentials to the restAccount profile which is automatically injected as
     * basicauth authentication on the request GET call to the backend
     * @param username 
     * @param password 
     */
    async login(username: string, password: string) {
      
        // set the initial login info, this is required for the basic-auth interceptor 
        // which will add it as basic authentication for the rest call
        const user: User = new User();
        user.authdata = window.btoa(`${username}:${password}`);
        user.username = username;
        user.password = null;
        this.restAccount = user;
        

        const userProfile:UserProfile = await this.restService.get("login").toPromise();

        if(userProfile === null) { return false; }
        user.role = userProfile.userrole;
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);

        return true;

    }

    /**
     * Logout the user and whipe the currentUserSubject
     */
    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }

    /**
     * Create a new user based on the user profile
     * @param userProfile
     */
    createUser(userProfile:UserProfile) {
        return this.restService.post("user", userProfile);
    }

    /**
     * Override a user property in the user profile and returns the updated profile
     * @param userProfile 
     */
    setUser(userProfile:UserProfile) {
        return this.restService.put("user", userProfile);
    }

    /**
     * Return the list with users
     */
    getUsers() {
        return this.restService.get("user");
    }

    /**
     * Remove the user from the repository
     * @param userProfile 
     */
    deleteUser(userProfile:UserProfile) {
        return this.restService.delete("user", userProfile.email);
    }
}