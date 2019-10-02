import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';
import swal, { SweetAlertOptions } from 'sweetalert2';
import { Router } from '@angular/router';
import { animate } from '@angular/animations';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService, private router:Router) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const options:SweetAlertOptions = {
            title: "Error", 
            text: "Wrong username or password", 
            type: "error",
            animation: false
        }

        return next.handle(request).pipe(catchError((err:HttpErrorResponse) => {

            console.log(err);
            if (err.status === 401) {
                // auto logout if 401 response returned from api
                this.authenticationService.logout();
                options.text = "Wrong username / password combination"
                swal.fire(options)
                this.router.navigate(['login']);
            }

            // other type of error:
            // check if it a validation error of the data:
            // 
            options.text = err.error.message || err.error.errors;
            swal.fire(options);

            const error = err.error.message || err.statusText;
            return throwError(error);
        }))
    }
}