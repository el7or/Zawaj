import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'localDay',
  pure: false
})
export class LocalDayPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return new Date(value).toLocaleString('ar',{weekday : 'long' , year :'numeric' , month : 'long',day:'numeric'})
  }

}
