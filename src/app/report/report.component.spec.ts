import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportComponent } from './report.component';
import { MatTableDataSource, MatTableModule } from '@angular/material';
import { CalendarEventService } from '../services/calendar-event.service';
import { CalendarEvent } from 'angular-calendar';
import { of, Observable } from 'rxjs';

class MockCalendarEventService {

  public getCalendarDatabaseEvents(): Observable<DatabaseCalendarEvent[]> {
    // return a fake set of calendar events that will be rendered by the datatable
    return of([{
      date: new Date(2019, 10, 30),
      owner: 'user@school.com',
      id: '1'
    }, {
      date: new Date(2019, 10, 31),
      owner: 'user2@school.com',
      id: '2'
    }]);
  }

}

describe('ReportComponent', () => {
  let component: ReportComponent;
  let fixture: ComponentFixture<ReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatTableModule],
      declarations: [ReportComponent],
      providers: [
        { provide: CalendarEventService, useClass: MockCalendarEventService }
      ],

    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('it should retrieve all events after onInit', () => {
    component.ngOnInit();
    expect(component.dataSource.data.length).toBe(2);
  });

  describe('testing the DOM', () => {
    it('should render the table header', () => {

      // the fixture native is a div that contains the html code of the template file
      // therefore, the first child of that div will be the root element (table) of the html code
      const tableElement: HTMLTableElement = <HTMLTableElement>(<HTMLElement>fixture.nativeElement).firstChild;

      expect(tableElement.rows[0].cells[0].textContent.trim()).toBe('Id.');
      expect(tableElement.rows[0].cells[1].textContent.trim()).toBe('Owner');
      expect(tableElement.rows[0].cells[2].textContent.trim()).toBe('Date');

    });

    it('should render all rows in the table', () => {
      const tableElement: HTMLTableElement = <HTMLTableElement>(<HTMLElement>fixture.nativeElement).firstChild;

      // rows -1 (minus the header) 
      expect(tableElement.rows.length - 1).toBe(component.dataSource.data.length);
    })
  })
});
