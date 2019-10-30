import { LanggService } from './../services/langg.service';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'localNumber',
  pure: false
})
export class LocalNumberPipe implements PipeTransform {

  constructor(private session: LanggService) { }

    transform(value: any) {
        if (value == null) { return ''; } // !value would also react to zeros.

        return value.toLocaleString(this.session.locale);
    }

}
