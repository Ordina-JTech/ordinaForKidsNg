import { Component, OnInit, Inject } from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { addDays, addHours, setHours, startOfDay, addMonths  } from 'date-fns';
import { CalendarEventService } from '../services/calendar-event.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../model/user';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css', '../../../node_modules/angular-calendar/css/angular-calendar.css']
})
export class CalendarComponent implements OnInit {

  constructor(private calendarEventService: CalendarEventService, public dialog: MatDialog, private authenticationService: AuthenticationService ) { }
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
    console.log(this.events);
  }

  dayClicked(day:Day): void {
    
    if(!day.inMonth) { this.setViewDate(day.date); }
    else if(day.isFuture) {
      // open dialog box to book the day
      const data = { 
        day : day, 
        action : this.calendarEventService.hasEventOnDate(day, true) ? 'delete' : 'create' ,
      }

      let dialogRef = this.dialog.open(CalendarEventBookingDialog, {
        width: '250px',
        data: data
      });
      dialogRef.afterClosed().subscribe(result => {
        
        if(result === "confirm") {
          // confirm the action
          switch(data.action) {
            case 'create' :
              this.calendarEventService.createCalendarEvent(day.date).subscribe(data => { console.log(data); this.loadCalendarEvents(); });
              break;

            case 'delete' :
              this.calendarEventService.eventsOnDate(day, true).forEach((calendarEvent:CalendarEvent) => {
                this.calendarEventService.deleteCalendarEvent(calendarEvent).subscribe( () => this.loadCalendarEvents());
              })
              break;

          }
          
        }
      });
    }
  }

  eventClicked(event:CalendarEvent): void {
    console.log(event);
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
  }
}


export interface DialogData {
  day: Day;
}

@Component({
  selector: 'calendar-event-booking-dialog',
  template: `
    <h1 mat-dialog-title>{{ data.day.date.toLocaleDateString() }}</h1>
    <div mat-dialog-content>
      Please confirm that you want to {{ data.action }} an event
    </div>
    <div mat-dialog-actions>
      <button mat-button mat-dialog-close="cancel" >Oops! never mind</button>
      <button mat-button mat-dialog-close="confirm" cdkFocusInitial>Confirm</button>
    </div>
  `,
})
export class CalendarEventBookingDialog {

  constructor(
    public dialogRef: MatDialogRef<CalendarEventBookingDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}


}