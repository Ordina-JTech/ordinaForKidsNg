import { Injectable } from '@angular/core';
import { RestService } from './rest.service';
import { startOfDay, addHours } from 'date-fns';
import { CalendarEvent } from 'angular-calendar';
import { AuthenticationService } from './authentication.service';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CalendarEventService {

  constructor(private restService: RestService, private authenticationService: AuthenticationService) { }

  myEventColor = { primary: '#e98300', secondary : '' }
  theirEventColor = { primary: 'gray', secondary : '' }

  getCalendarEvents():Observable<CalendarEvent[]> {
    const calEvents = this.restService
          .get("calendar_events");
          return <Observable<CalendarEvent[]>> calEvents;
  }

  createCalendarEvent(date: Date) {
    return this.restService.post("calendar_events", {
      date: date
    });
  }

  deleteCalendarEvent(calendarEvent:CalendarEvent) {
    return this.restService.delete("calendar_events", calendarEvent.id.toString());
  }

  /**
   * Converts the data from database calendar events to UI calendar events
   * @param databaseCalendarEvents 
   */
  toCalendarEvents(databaseCalendarEvents:DatabaseCalendarEvent[]):CalendarEvent[] {
    return databaseCalendarEvents.map(databaseCalendarEvent => {
      return {
        start: addHours(startOfDay(databaseCalendarEvent.date), 9),
        end: addHours(startOfDay(databaseCalendarEvent.date), 15),
        title: databaseCalendarEvent.owner,
        id: databaseCalendarEvent.id,
        color: (databaseCalendarEvent.owner === this.authenticationService.currentUserValue.username ? this.myEventColor : this.theirEventColor)
      }
    })
  }

  /**
   * Returns all the events on the day (calendar object),
   * either all (onlyCurrentUser = false) or for the currently logged in user
   * @param day 
   * @param onlyCurrentUser - defaults to true
   */
  eventsOnDate(day:Day, onlyCurrentUser:boolean=true):CalendarEvent[] {
    return day.events.filter((event:CalendarEvent) => {
      return !onlyCurrentUser || event.title === this.authenticationService.currentUserValue.username;
    });
  }

  /**
   * This method is used to determine if there is an event on the provided day (calendar object), 
   * either at all (onlyCurrentUser = false) or for the currently logged in user
   * @param day 
   * @param onlyCurrentUser - defaults to false
   */
  hasEventOnDate(day:Day, onlyCurrentUser:boolean=false):boolean {
    return this.eventsOnDate(day, onlyCurrentUser).length > 0;
  }
}
