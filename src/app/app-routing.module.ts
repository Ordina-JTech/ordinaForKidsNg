import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CalendarComponent } from './calendar/calendar.component';


const routes: Routes = [{
  path: 'calendar',
  component: CalendarComponent,
  data: { title: 'Calendar' }
  },{
    path: '',
    redirectTo: '/calendar',
    pathMatch: 'full'
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
