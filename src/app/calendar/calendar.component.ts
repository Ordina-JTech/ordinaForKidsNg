import { Component, OnInit } from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { addDays, addHours, setHours, startOfDay  } from 'date-fns';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  constructor() { }
  CalendarView = CalendarView;
  viewMode:CalendarView = CalendarView.Week;
  viewDate: Date = new Date();
  excludeDays: number[] = [0, 6];
  events: CalendarEvent[] = [{
    start: addHours(startOfDay(new Date()), 9),
      end: addHours(startOfDay(new Date()), 18),
    title: 'Test',

  }];

  ngOnInit() {
    console.log(this.viewMode);
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    console.log(date);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    console.log(event);
  }

  setViewMode(viewMode: CalendarView) {
    this.viewMode = viewMode;
  }
  

}
