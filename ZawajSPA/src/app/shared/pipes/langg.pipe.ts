import { Pipe, PipeTransform } from "@angular/core";
// @ts-ignore
import * as words from "../../../assets/locale/translation.json";
import { LanggService } from "../services/langg.service.js";

@Pipe({
  name: "langg",
  pure: false
})
export class LanggPipe implements PipeTransform {
  _words = [];

  constructor(private langgService: LanggService) {
    this._words = words.default;
  }

  transform(value: string, args?: any): any {
    let words = this._words.filter(o =>
      Object.keys(o).some(k => o[k] == value)
    );
    value = words[0][this.langgService.locale];
    return value;
  }
}
