import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CalendarComponent } from './calendar/calendar.component';
import { LoginComponent } from './login/login.component';
import { UserComponent } from './user/user.component';


const routes: Routes = [
  {
    path: 'calendar',
    component: CalendarComponent,
    data: { title: 'Calendar' }
  }
  ,
  {
    path: 'user',
    component: UserComponent,
    data: { title: 'User accounts'}
  }
  ,
  {
    path: 'login',
    component: LoginComponent,
    data: { title: 'Login' }
  }
  ,
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
