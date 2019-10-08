import { TestBed } from '@angular/core/testing';

import { CalendarEventService } from './calendar-event.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RestService } from './rest.service';
import { AuthenticationService } from './authentication.service';
import { Observable } from 'rxjs';
import { CalendarEvent, CalendarDateFormatter } from 'angular-calendar';
import { of } from 'rxjs';
import { isDate } from 'util';

class MockRestService {
  get(controller:string):Observable<CalendarEvent[]> {
    return of<CalendarEvent[]>([{
      start: new Date(),
      title: "Some event"
    }, 
    {
      start: new Date(),
      title: "Some other event"
    }]);
  }

  post(controller:string, data:{date}):Observable<boolean> {
    return of<boolean>(controller === 'calendar_events' && data && data.date && isDate(data.date));
  }

  delete(controller:string, id:string):Observable<string> {
    return of<string>(`${controller}/${id}`);
  }
}

class MockAuthService {
  public currentUserValue = { "username" : "testuser"}
}

describe('CalendarEventService', () => {

  let service: CalendarEventService;
  let authService: MockAuthService;
  let controller: string = 'calendar_events';

  let databaseCalendarEvents:DatabaseCalendarEvent[] = [{
    date: new Date(2019, 10, 31),
    owner: "testuser",
    id: "1"
  },
  {
    date: new Date(2019, 10, 30),
    owner: "testuser2",
    id: "2"
  }]


  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CalendarEventService,
        
        // The CalendarEventService uses 2 DIs: 
        // The RestService and the AuthenticationService
        // to make a shallow unit test for the CalendarEventService, both will be mocked 
        {
          // Also, mock the RestService
          provide: RestService, useClass: MockRestService
        },
        {
          provide: AuthenticationService, useClass: MockAuthService
        }
      ],
    });
  })

  beforeEach(() => {
    service = TestBed.get(CalendarEventService);
    authService = TestBed.get(AuthenticationService); // this will get the MOCK authentication service (see DI switch in TestBed configuration)
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCalendarEvents()', () => {
    it('should retrieve the calendar events', async () => {

      let events = await service.getCalendarEvents().toPromise();
      expect(events.length).toBe(2);
    }) 
  })

  describe('createCalendarEvent()', () => {
    it('should post a body that contains a date to the correct controller', async () => {
      // post a new date to the mockRestService that will validate the controller and if the JSON Object is correct
      expect(await service.createCalendarEvent(new Date()).toPromise()).toBe(true);
    }) 
  })

  describe('deleteCalendarEvent()', () => {
    it('should send a delete call to the right endpoint using the rest controller', async() => {
      // post a delete command to the mockRestService that will validate the controller and if the endpoint is correct
      let controller_id = await service.deleteCalendarEvent({ start: new Date(), id: 1, title: "New event" }).toPromise();
      expect(controller_id).toBe(`${controller}/1`);
    })
  })

  describe('toCalendarEvents()', () => {
    
    let calendarEvents:CalendarEvent[];

    it('should return the same number of events as were put in', () => {
      calendarEvents  = service.toCalendarEvents(databaseCalendarEvents);
      expect(calendarEvents.length).toBe(databaseCalendarEvents.length);
    })

    it('should persist the owner as title and the event for mapping id', () => {
      calendarEvents  = service.toCalendarEvents(databaseCalendarEvents);
      databaseCalendarEvents.forEach(databaseCalendarEvent => {
        expect(calendarEvents.find(calendarEvent => calendarEvent.id === databaseCalendarEvent.id).title).toBe(databaseCalendarEvent.owner);
      });
    })

    it('should create a specific color for the event if the current user is logged in', () => {
      calendarEvents  = service.toCalendarEvents(databaseCalendarEvents);
      expect(calendarEvents.find(calendarEvent => calendarEvent.title === authService.currentUserValue.username).color).toBe(service.myEventColor);
      expect(calendarEvents.find(calendarEvent => calendarEvent.title !== authService.currentUserValue.username).color).toBe(service.theirEventColor);
    });
  });

  describe('eventsOnDate()', () => {
    it('should return all the events for a specific day', () => {
      let day = <Day>{
        events: service.toCalendarEvents(databaseCalendarEvents)
      }
      expect(service.eventsOnDate(day, false).length).toBe(2);
    });

    it('should return all the events for a specific day for only the specific user', () => {
      let day = <Day>{
        events: service.toCalendarEvents(databaseCalendarEvents)
      }
      let eventsOnDay = service.eventsOnDate(day, true);
      expect(eventsOnDay.length).toBe(1);
      expect(eventsOnDay[0].title === authService.currentUserValue.username);
    })

  })

  describe('hasEventOnDay()', () => {
    it('should return true for user = testuser', () => {
      let day = <Day>{
        events: service.toCalendarEvents(databaseCalendarEvents)
      }
      expect(service.hasEventOnDate(day, true)).toBe(true);
    }) 

    it('should return false if no events are present on that day', () => {
      expect(service.hasEventOnDate(<Day>{ events: []})).toBe(false);
    });
  });
  
});
