import { LanggService } from './../services/langg.service';
import { Pipe, PipeTransform } from '@angular/core';
import { formatDate } from '@angular/common';

@Pipe({
  name: 'localDate',
  pure: false
})
export class LocalDatePipe implements PipeTransform {

  constructor(private session: LanggService) { }

    transform(value: any, format: string) {
     
        if (!value) { return ''; }
        if (!format) { format = 'shortDate'; }

        return formatDate(value, format, this.session.locale);        
    }

}
