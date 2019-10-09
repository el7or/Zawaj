import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Title } from "@angular/platform-browser";
// @ts-ignore
import * as words from "../../../assets/locale/translation.json";

@Injectable({
  providedIn: "root"
})
export class LanggService {
  _words = [];
  elementsArray = new BehaviorSubject<[]>([]);
  PlacholdersArray = new BehaviorSubject<[]>([]);
  language = new BehaviorSubject<string>(
    localStorage.getItem("langg") == "en" ? "en" : "ar"
  );
  lang = this.language.asObservable();

  constructor(titleService: Title) {
    this.lang.subscribe(lang => {
      if (lang == "en") {
        localStorage.setItem("langg", "en");
        titleService.setTitle("Zawaj");
      } else {
        localStorage.setItem("langg", "ar");
        titleService.setTitle("موقع زواج");
      }
    });
  }

  translateWithoutDerctive() {
    this._words = words.default;
    let runTimeElements = document.querySelectorAll(
      ".menu-title, div.message, span.title.subtitle, #swal2-title, #swal2-content, .swal2-confirm, .swal2-cancel, nb-option.ng-star-inserted, span.info, span.tab-text, div.user-name"
    );
    let runTimeElementsArray = Array.prototype.slice.call(runTimeElements);
    let lastElementsArray = this.elementsArray.value;
    if (lastElementsArray.length != runTimeElementsArray.length) {
      runTimeElementsArray.forEach(element => {
        this.lang.subscribe((lang: string) => {
          try {
            let words = this._words.filter(o =>
              Object.keys(o).some(
                k => o[k] == element.innerText || o[k] == element.innerHTML
              )
            );
            element.innerText = words[0][lang];
          } catch {}
        });
      });
      this.elementsArray.next(runTimeElementsArray);
    }

    let runTimePlacholders = document.querySelectorAll("input.search-input");
    let runTimePlacholdersArray = Array.prototype.slice.call(
      runTimePlacholders
    );
    let lastPlacholdersArray = this.PlacholdersArray.value;
    if (lastPlacholdersArray.length != runTimePlacholdersArray.length) {
      console.log(runTimePlacholdersArray);
      runTimePlacholdersArray.forEach(element => {
        this.lang.subscribe((lang: string) => {
          try {
            let words = this._words.filter(o =>
              Object.keys(o).some(k => o[k] == element.placeholder)
            );
            element.placeholder = words[0][lang];
          } catch {}
        });
      });
      this.PlacholdersArray.next(runTimePlacholdersArray);
    }
  }
}
