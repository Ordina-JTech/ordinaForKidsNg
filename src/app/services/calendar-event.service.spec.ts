import { TestBed } from '@angular/core/testing';

import { CalendarEventService } from './calendar-event.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';

describe('CalendarEventService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule, HttpClientModule], 
    providers: [CalendarEventService ]
}));

  it('should be created', () => {
    const service: CalendarEventService = TestBed.get(CalendarEventService);
    expect(service).toBeTruthy();
  });
});
