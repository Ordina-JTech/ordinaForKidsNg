import { TestBed } from '@angular/core/testing';

import { AuthenticationService } from './authentication.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable, of, throwError } from 'rxjs';
import { HTTP_INTERCEPTORS, HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';

/**
 * Since most of the authentication service processes will simply forward information to rest service it has little use to mock the rest
 * service directly which will not tell us much. Instead, we will mock the HttpInterceptor so that we can validate that the payload is 
 * correctly send to the endpoints and exception handling (wrong username/password)
 */
@Injectable()
export class MockHttpInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>  {
        
      // assign shorthands
      const { url, method } = request;

      // make authenticationService accessible to nested methods of handleRoute calls
      const authenticationService = this.authenticationService;

      // return the observable and catch (deliberate) exceptions
      return of(null)
      .pipe(handleRoute)
      .pipe(catchError((err:HttpErrorResponse) => {

          if (err.status === 401) {
            // auto logout if 401 response returned from api
            this.authenticationService.logout();
          }
            const error = err.error.message || err.statusText;
            return throwError(error);
      }));

        // handleRoute will check the url and trigger a corresponding response
        // based on the behavior of the backend
        function handleRoute() {
          switch (true) {
              case url.endsWith('/login') && method === 'GET':
                  return authenticate();
              case url.indexOf('/user') > -1:
                  return ok({ method: method, body: request.body, id: request.url.split('/').pop(), controller: 'user' })

              default:
                  // pass through any requests not handled above
                  return next.handle(request);
          }
      }

      // Authentication mocking will allow a single account to be able to login
      // and return a user profile when the user has succesfully logged in
      function authenticate() {
        const authenticatedUsers = [
          window.btoa("school:user") // we mock the encrypted school:user as the only valid account
        ]
        const userProfileOnSuccess:UserProfile = {
          email: 'school@user.com',
          userrole: 'school',
          firstname: 'school',
          lastname: 'user',
          password: null
        }
        return authenticatedUsers.indexOf(authenticationService.restAccount.authdata) > -1 ? ok(userProfileOnSuccess) : unauthorized();
      }

      // return a success response with optional body
      function ok(body?) {
        return of(new HttpResponse({ status: 200, body }))
      }

      // return 401, error message is evaluated by the unit test so don't modify it!
      function unauthorized() {
        return throwError({ status: 401, error: { message: 'Unauthorised' } });
    }

    }
}

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  beforeEach(() => 
    {
      
  
      TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        // {provide: RestService, useClass: MockRestService},
        {provide: HTTP_INTERCEPTORS, useClass: MockHttpInterceptor, multi: true },
      ] })

      service  = TestBed.get(AuthenticationService);
      spyOn(service, "logout").and.callThrough();
    }
  );

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /**
   * The purpose of these tests is to check that the request and response mechanism is handled correctly
   * within the AuthenticationService.
   * 
   * A successfull login attempt should return in the UserProfile to be set to the AuthenticationService
   * A unsuccessfull login attempt should throw an exception which is caught
   * NOTE: It would be better to tell Jasmine to expect an error to be thrown but I could not find a quick solution
   * on how to do this for async methods. Documentation indicates that this might not be available right now.
   */
  describe('login()', () => {
    it('should login the school user succcessfully', async () => {
      // login doesn't return an observable but simply set's the credentials, runs the login and then
      // sets the currentUser value if the login was succesfull
      const username = "school";
      const password = "user"

      // run the login method with the MockRestService (look up)
      // when the login information matches the approved account (school:user), the login method will return true
      // which we will use to validate that login() can actually login a user
      await service.login(username, password).then(loggedIn => {
        expect(loggedIn).toBe(true);
        expect(service.restAccount.username).toBe(username);
        expect(service.restAccount.password).toBe(null);  // password is never stored
        expect(service.restAccount.authdata).toBe(window.btoa(`${username}:${password}`))
  
        // we can spy on the logout method to check if it has been called forcefully which happens when the credentials are wrong
        expect(service.logout).toHaveBeenCalledTimes(0);

        // finally, check that the CurrentUser profile has also been set to the logged in user:
        expect(service.currentUserValue.username).toBe(username);
        expect(service.currentUserValue.password).toBe(null); // password is never stored
        expect(service.currentUserValue.role).toBe('school');
        expect(service.currentUserValue.authdata).toBe(window.btoa(`${username}:${password}`));
      })     
      
    })
    
    it('should not login the school user when the password is wrong', async () => {
      // same as above but now with wrong credentials, this should throw an 'unauthorized' exception
      const username = "school";
      const password = "badpassword";

      try{
        await service.login(username, password).then(() => {
          // if all goes right, the user should not be able to login
          // meaning that this code should never be reached since an 'Unauthorised' exception is thrown
          expect(false).toBe(true); // <-- exception not thrown, test fails
        })
      }catch(e) {
        expect(e).toBe('Unauthorised');
      }
      
    })
  })

  describe("logout()", () => {
    it('should remove the current user', async () => {

      // call the login:
      const loggedIn:boolean = await service.login("school" , "user"); // login, the Spy will mock the behavior so login credentials doesn't matter
      expect(loggedIn).toBe(true);

      // check if the currentUser has been assigned:
      expect(service.currentUserValue.username).toBe('school');
      
      // call the logout
      service.logout();

      // check the currentUser again:
      expect(service.currentUserValue).toBe(null);
    })
  })

  /**
   * Simply test if the authentication service is correctly sending the requests to the right endpoints with the correct payload
   * using the response to validate it
   * 
   * response is set by the MockHttpIntercept 
   */
  describe("Rest interactions, should forward info correctly to RestService", () => {
    it('createUser => send as POST to correct endpoint', async () => {
      const userProfile: UserProfile = {
        email: "user@school.com"
      }
      await service.createUser(userProfile).toPromise().then((response:any) => {
        expect(response.controller).toBe('user');
        expect(response.body.email).toBe(userProfile.email);
        expect(response.method).toBe("POST");
      })
    });

    it('setUser => send as PUT to correct endpoint', async () => {
      const userProfile: UserProfile = {
        email: "user@school.com"
      }
      await service.setUser(userProfile).toPromise().then((response:any) => {
        expect(response.controller).toBe('user');
        expect(response.body.email).toBe(userProfile.email);
        expect(response.method).toBe("PUT");
      })
    });

    it('deleteUser => send as DELETE to correct endpoint', async () => {
      const userProfile: UserProfile = {
        email: "user@school.com"
      }
      await service.deleteUser(userProfile).toPromise().then((response:any) => {
        expect(response.controller).toBe('user');
        expect(response.method).toBe("DELETE");
        expect(response.id).toBe(userProfile.email);
      })
    })

    it('getUsers => send as GET to correct endpoint', async () => {
      await service.getUsers().toPromise().then((response:any) => {
        expect(response.controller).toBe('user');
        expect(response.method).toBe("GET");
      })
    })
  }) 
});
