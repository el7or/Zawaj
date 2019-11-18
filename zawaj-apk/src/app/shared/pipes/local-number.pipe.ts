import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'localNumber',
  pure: false
})
export class LocalNumberPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if (value == null) { return ''; } // !value would also react to zeros.

        return value.toLocaleString('ar');
  }

}
