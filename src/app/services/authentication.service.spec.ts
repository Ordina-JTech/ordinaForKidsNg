import { TestBed } from '@angular/core/testing';

import { AuthenticationService } from './authentication.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RestService } from './rest.service';
import { Observable, of, throwError } from 'rxjs';
import { HTTP_INTERCEPTORS, HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../model/user';
import { catchError, mergeMap, materialize, delay, dematerialize } from 'rxjs/operators';

/**
 * Mock the HttpInterceptor instead of the RestService. 
 * This will allow us to send HttpResponses and mock the exceptions that will result in logout
 */
@Injectable()
export class MockHttpInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>  {
        
      const { url, method, headers, body } = request;

      const authenticationService = this.authenticationService;

      return of(null)
      .pipe(mergeMap(handleRoute))
      .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
      .pipe(delay(500))
      .pipe(dematerialize())
      .pipe(catchError((err:HttpErrorResponse) => {
            
            const error = err.error.message || err.statusText;
            return throwError(error);
      }));

      
        function handleRoute() {
          switch (true) {
              case url.endsWith('/login') && method === 'GET':
                  return authenticate();
              default:
                  // pass through any requests not handled above
                  return next.handle(request);
          }
      }

      function authenticate() {
        const authenticatedUsers = [
          window.btoa("school:user") // we mock the encrypted school:user as the only valid account
        ]
        return authenticatedUsers.indexOf(authenticationService.restAccount.authdata) > -1 ? ok() : unauthorized();
      }

      function error(message) {
        return throwError({ error: { message } });
      }

      function ok(body?) {
        return of(new HttpResponse({ status: 200, body }))
      }

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
    }
  );

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login()', () => {
    it('should login the current user', () => {
      // login doesn't return an observable but simply set's the credentials, runs the login and then
      // sets the currentUser value if the login was succesfull
      const username = "schooluser";
      const password = "user"

      service.login(username, password)
      
      // the restAccount stores the login credentials that are used to login.
      expect(service.restAccount.username).toBe(username);
      expect(service.restAccount.password).toBe(password);
      expect(service.restAccount.authdata).toBe(window.btoa(`${username}:${password}`))

    }) 
  })
});
