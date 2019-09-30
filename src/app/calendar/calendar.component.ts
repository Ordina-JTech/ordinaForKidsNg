import { Component, OnInit, Inject } from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { addDays, addHours, setHours, startOfDay, addMonths  } from 'date-fns';
import { CalendarEventService } from '../services/calendar-event.service';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../model/user';
import swal, { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css', '../../../node_modules/angular-calendar/css/angular-calendar.css']
})
export class CalendarComponent implements OnInit {

  constructor(private calendarEventService: CalendarEventService, private authenticationService: AuthenticationService ) { }
  CalendarView = CalendarView;
  viewMode:CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  excludeDays: number[] = [0, 6];
  events: CalendarEvent[];
  user: User = this.authenticationService.currentUserValue;

  ngOnInit() {
    this.loadCalendarEvents();
    
  }

  loadCalendarEvents() {
    this.calendarEventService.getCalendarEvents().subscribe((data:DatabaseCalendarEvent[]) => {
      this.events = this.calendarEventService.toCalendarEvents(data);
    })
  }

  dayClicked(day:Day): void {
    
    if(!day.inMonth) { this.setViewDate(day.date); }
    else if(day.isFuture) {
      // open dialog box to book the day
      const data = { 
        day : day, 
        action : this.calendarEventService.hasEventOnDate(day, true) ? 'delete' : 'create' ,
      }

      if(this.calendarEventService.hasEventOnDate(day, true)) {
        let options: SweetAlertOptions = {
          title: "Are you sure?",
          text: "You already have a booked slot on this day, do you wish to remove it?",
          type: "warning",
          showCancelButton: true,
          animation: false
        }
        // this user already has an event booked on this day, clicking it will remove it
        swal.fire(options).then(confirm => {
          if(confirm.value) {
            this.calendarEventService.deleteCalendarEvent(
              this.calendarEventService.eventsOnDate(day, true).pop()
            ).subscribe(() => {
              this.loadCalendarEvents(); 
              options = {
                title: "You will be missed",
                text: "We hope to see you some other time, for now your event has been removed",
                type: "success",
                animation: false
              }
              swal.fire(options);
            });
          }
        })
      }
      else{
        let options: SweetAlertOptions = {
          title: "Are you sure?",
          text: "Are you sure you want to create a new booking for this day?",
          type: "question",
          showCancelButton: true,
          animation: false
        }
        swal.fire( options ).then(confirm => {
          if(confirm.value) {
            this.calendarEventService.createCalendarEvent(day.date).subscribe(() => {
              this.loadCalendarEvents(); 
              options = {
                title: "YOU ARE AWESOME!",
                text: "You have booked an amazing event for your school!",
                type: "success",
                animation: false
              }
              swal.fire(options);
            });
          }
        })
        
      }
      
    }
  }

  eventClicked(event:CalendarEvent): void {
    // no operation yet. Only day clicked is currently active
  }
  setViewDate(date:Date)
  {
    this.viewDate = date;
  }
  resetViewDate() {
    this.viewDate = new Date();
  }
  setViewMode(viewMode: CalendarView) {
    this.viewMode = viewMode;
  }
  browseMonth(step:number) {
    this.setViewDate(addMonths(this.viewDate, step));
  }

  setUser(usernumber:number) {
    this.authenticationService.login(`schooluser${usernumber}`, 'school');
    this.user = this.authenticationService.currentUserValue;
    this.loadCalendarEvents();
  }
}
