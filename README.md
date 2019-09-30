# OrdinaForKids

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.5.

## Getting started
- Run npm install
- Run ng serve --open to load in browser

## Architecture

### Routing
Currently only Calendar is showing, Routing component has already been created and integrated for future developments. Defaults to Calendar, this should be the information page in the future

### Authentication
User login / password is required for all REST calls to the backend. All outgoing requests are intercepted /app/helpers/basic-auth.interceptor and the local login account is added as BASIC authentication.

### Calendar
The Angular Calendar component developed by Matt Lewis is used which is provided with a MIT license. https://mattlewis92.github.io/angular-calendar/#/kitchen-sink

Integration with REST calls is handled in the calendar-event.service

### Sweet Alert
Dialogs for information and confirmation uses the SweetAlert 2, https://github.com/sweetalert2/sweetalert2 , which is proveded with a MIT license. 