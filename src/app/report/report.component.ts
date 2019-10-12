import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { CalendarEventService } from '../services/calendar-event.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  constructor(private calendarEventService: CalendarEventService) { }

  ngOnInit() {

    this.loadEvents();

  }

  loadEvents() {
    this.calendarEventService.getCalendarDatabaseEvents().subscribe((data: DatabaseCalendarEvent[]) => {

      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
    })
  }

  displayedColumns: string[] = ['id', 'owner', 'date'];
  dataSource: MatTableDataSource<DatabaseCalendarEvent>;

  @ViewChild(MatSort, { static: true }) sort: MatSort;


}
