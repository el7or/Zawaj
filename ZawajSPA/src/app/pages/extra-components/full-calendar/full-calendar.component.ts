import { Component, OnInit, OnDestroy } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import arLocale  from '@fullcalendar/core/locales/ar'
import enLocale  from '@fullcalendar/core/locales/en-gb'
import { LanggService } from '../../../@theme/services/langg.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ngx-full-calendar',
  templateUrl: './full-calendar.component.html',
  styleUrls: ['./full-calendar.component.scss']
})
export class FullCalendarComponent implements OnInit,OnDestroy{

  calendarPlugins = [ dayGridPlugin, timeGridPlugin, listPlugin ];
  calendarHeader = { center: 'dayGridMonth,timeGridWeek,listWeek' }

  locle:any;
  langObservable: Subscription;

  calendarEvents = [
    { title: 'event 1', date: '2019-09-01' }
  ];

  constructor(private langgService:LanggService){    
  }
  ngOnInit(){
    this.langObservable = this.langgService.lang.subscribe(
      lang=>{
        if(lang == 'en'){
          this.locle= enLocale;
        }else{
          this.locle = arLocale;
        }
      }
    );
  }
  ngOnDestroy(){
    this.langObservable.unsubscribe();
  }

  addEvent() {
    this.calendarEvents.push({ title: 'event 2', date: '2019-09-02' });
  }

  modifyTitle(eventIndex, newTitle) {
    this.calendarEvents[eventIndex].title = newTitle;
  }

  eventClick(info) {
    alert('Event: ' + info.event.title);
    alert('Coordinates: ' + info.jsEvent.pageX + ',' + info.jsEvent.pageY);
    alert('View: ' + info.view.type);

    // change the border color just for fun
    info.el.style.borderColor = 'red';
  }
}
