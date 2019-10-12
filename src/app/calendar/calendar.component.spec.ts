import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarComponent } from './calendar.component';
import { CalendarModule, CalendarUtils, CalendarDateFormatter, DateAdapter, CalendarEvent } from 'angular-calendar';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { AuthenticationService } from '../services/authentication.service';
import { CalendarEventService } from '../services/calendar-event.service';
import { MaterialModule } from '../helpers/material.module';
import { Observable, of } from 'rxjs';
import { inherits } from 'util';
import { addHours, startOfDay, endOfDay } from 'date-fns';
import { By } from '@angular/platform-browser';
import { RestService } from '../services/rest.service';
import Swal from 'sweetalert2';

/**
 * We will mock our own services that are used to perform the shallow tests
 * However, we will test the DOM rendering of the calendar object
 */

class MockAuthenticationService {
  // the current user info is used frequently, mock it with the school@user.com account
  // we will use multiple events, both with a different user and using school@user.com as the current account
  // to validate that the coloring is performed correctly
  public currentUserValue = { username: 'school@user.com' }
}

class MockCalendarEventService extends CalendarEventService {

  myEventColor = { primary: '#e98300', secondary: '' }
  theirEventColor = { primary: 'gray', secondary: '' }

  getCalendarDatabaseEvents() {
    return of(this.mockEvents);
  }

  private mockEvents = [{
    date: new Date(2018, 9, 30),
    owner: 'school@user.com',
    id: '1'
  },
  {
    date: new Date(2018, 9, 31),
    owner: 'otherschool@user.com',
    id: '2'
  },
  {
    date: new Date(2018, 9, 31),
    owner: 'school@user.com',
    id: '3'
  }];

  async getCalendarEvents() {
    const calendarDatabaseEvents = await this.getCalendarDatabaseEvents().toPromise();

    return this.toCalendarEvents(<DatabaseCalendarEvent[]>calendarDatabaseEvents);
  }

  createCalendarEvent(date: Date) {
    const event: DatabaseCalendarEvent = {
      date: date,
      owner: 'school@user.com',
      id: (this.mockEvents.length + 1 + '')
    }
    this.mockEvents.push(event);
    return of(event);
  }
}

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
        MaterialModule
      ],

      declarations: [CalendarComponent],
      providers: [
        CalendarUtils,
        CalendarDateFormatter,
        { provide: AuthenticationService, useClass: MockAuthenticationService },
        { provide: CalendarEventService, useClass: MockCalendarEventService },
        { provide: RestService, useValue: {} },

      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('component ts', () => {
    it('should load all the events in the appropriate binding variable', async () => {
      await component.loadCalendarEvents();
      expect(component.events.length).toBe(3);
    })
    it('should assign the loggedin user as the current user', () => {
      expect(component.user.username).toBe('school@user.com');
    })
    it('should navigate to the correct view date', () => {
      // set the viewdate 10 = November:
      const date: Date = new Date(2019, 10, 1);
      component.setViewDate(date);
      fixture.detectChanges();

      // detect if the title is November 2019
      let title: HTMLElement = fixture.debugElement.query(By.css('#monthTitle')).nativeElement;
      // compare using the toLocaleString to make the unit test compatible with different languages
      expect(title.textContent.trim()).toBe(`${date.toLocaleString('default', { month: 'long' })} - ${date.getFullYear()}`);
    })
    it('should jump to the next month when a day in the next month is clicked', () => {

      const date: Date = new Date(2019, 11, 1);
      // mimic clicking on the day 2019 - december - 1 while being active in the november calendar
      // we can test this in TS only by using a mocked day where inMonth is already set to false
      const day: Day = <Day>{ date: date, inMonth: false }

      component.dayClicked(day);
      fixture.detectChanges();

      // detect if the title is now December 2019
      let title: HTMLElement = fixture.debugElement.query(By.css('#monthTitle')).nativeElement;
      expect(title.textContent.trim()).toBe(`${date.toLocaleString('default', { month: 'long' })} - ${date.getFullYear()}`);

    })
    it('should prompt the confirm window to book a date on an available slot', async () => {

      const date: Date = new Date(2019, 9, 29);
      const service: CalendarEventService = TestBed.get(CalendarEventService);
      let events: CalendarEvent[] = await service.getCalendarEvents();

      const day: Day = <Day>{ date: date, inMonth: true, isFuture: true }
      day.events = <[]>service.filterEventsForDate(day, events);

      // spy on the SweetAlert and track the arguments that were send:
      spyOn(Swal, 'fire').and.callThrough();

      component.dayClicked(day);
      const swalSpy = <jasmine.Spy>Swal.fire;

      // do a property comparison on the config object that was send to the SweetAlert.fire method
      // checking if the object contains atleast the field text: ...
      // this way we don't have to write a full comparison
      expect(swalSpy.calls.mostRecent().args.pop()).toEqual(
        jasmine.objectContaining({ text: "Are you sure you want to create a new booking for this day?" }));

      // clicking confirm should trigger the createCalendarEvent on the event service:
      spyOn(service, "createCalendarEvent").and.callThrough();

      Swal.clickConfirm();
      fixture.detectChanges();
      // should have closed the sweet alert prompt
      expect(Swal.isVisible()).toBe(false);

      // retrieve the events from the service:
      events = await service.getCalendarEvents();
      expect(events.length).toBe(4);

      // finally, check if the createCalendarEvent method was actually called with the right information:
      expect(service.createCalendarEvent).toHaveBeenCalledWith(day.date);

    })
  })
});
