import { Injectable } from '@angular/core';
import { RestService } from './rest.service';
import { startOfDay, addHours } from 'date-fns';
import { CalendarEvent } from 'angular-calendar';
import { AuthenticationService } from './authentication.service';


@Injectable({
  providedIn: 'root'
})
export class CalendarEventService {

  constructor(private restService: RestService, private authenticationService: AuthenticationService) { }


  getCalendarEvents() {
    const calEvents = this.restService
          .get("calendar_events");
          return calEvents;
  }

  createCalendarEvent(date: Date) {
    return this.restService.post("calendar_events", {
      date: date
    })
  }

  deleteCalendarEvent(calendarEvent:CalendarEvent) {
    return this.restService.delete("calendar_events", calendarEvent.id.toString());
  }

  toCalendarEvents(databaseCalendarEvents:DatabaseCalendarEvent[]):CalendarEvent[] {
    return databaseCalendarEvents.map(databaseCalendarEvent => {
      return {
        start: addHours(startOfDay(databaseCalendarEvent.date), 9),
        end: addHours(startOfDay(databaseCalendarEvent.date), 15),
        title: databaseCalendarEvent.owner,
        id: databaseCalendarEvent.id
      }
    })
  }

  eventsOnDate(day:Day, onlyCurrentUser:boolean=true):CalendarEvent[] {
    return day.events.filter((event:CalendarEvent) => {
      return !onlyCurrentUser || event.title === this.authenticationService.currentUserValue.username;
    });
  }

  hasEventOnDate(day:Day, onlyCurrentUser:boolean=false):boolean {
    return this.eventsOnDate(day, onlyCurrentUser).length > 0;
  }
}
