import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../model/user';


@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) { }


    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with basic auth credentials if available
        const restUser:User = this.authenticationService.restAccount;
        if (restUser && restUser.authdata) {
            request = request.clone({
                setHeaders: { 
                    Authorization: `Basic ${restUser.authdata}`
                }
            });
        }


        return next.handle(request);
    }
}