import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateWithoutTime',
  pure: false
})
export class DateWithoutTimePipe implements PipeTransform {

  transform(date: any, args?: any): any {
    return (
      new Date(date).getFullYear() +
      "-" +
      (new Date(date).getMonth() + 1) +
      "-" +
      new Date(date).getDate()
    );
  }

}
