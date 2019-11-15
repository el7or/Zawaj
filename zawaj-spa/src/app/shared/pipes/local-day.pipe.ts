import { Pipe, PipeTransform } from '@angular/core';
import { LanggService } from '../services/langg.service';

@Pipe({
  name: 'localDay',
  pure: false
})
export class LocalDayPipe implements PipeTransform {

  constructor(private session: LanggService) { }

  transform(value: any, args?: any): any {
    return new Date(value).toLocaleString(this.session.locale,{weekday : 'long' , year :'numeric' , month : 'long',day:'numeric'})
  }
}
