import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Title } from "@angular/platform-browser";
import { registerLocaleData } from "@angular/common";
// @ts-ignore
import * as words from "../../../assets/locale/translation.json";
import localeArabic from "@angular/common/locales/ar";
import localeEnglish from "@angular/common/locales/en";
import { NbLayoutDirectionService, NbLayoutDirection } from "@nebular/theme";

@Injectable({
  providedIn: "root"
})
export class LanggService {
  _words = [];
  elementsArray = new BehaviorSubject<[]>([]);
  placholdersArray = new BehaviorSubject<[]>([]);
  language = new BehaviorSubject<string>(
    localStorage.getItem("langg") == "en" ? "en" : "ar"
  );
  lang = this.language.asObservable();
  langLoading = new BehaviorSubject<boolean>(false);

  _locale: string;
  set locale(value: string) {
    this._locale = value;
  }
  get locale(): string {
    return localStorage.getItem("langg") || "ar";
  }

  // change language from button to translate from langg directive:
  constructor(
    titleService: Title,
    private dirService: NbLayoutDirectionService
  ) {
    this.lang.subscribe(lang => {
      if (lang == "en") {
        localStorage.setItem("langg", "en");
        titleService.setTitle("Zawaj");
        this.registerCulture("en");
        if (this.dirService.isRtl) {
          this.dirService.setDirection(NbLayoutDirection.LTR);
        }
      } else {
        localStorage.setItem("langg", "ar");
        titleService.setTitle("موقع زواج");
        this.registerCulture("ar");
        if (this.dirService.isLtr) {
          this.dirService.setDirection(NbLayoutDirection.RTL);
        }
      }
    });
  }

  registerCulture(culture: string) {
    if (!culture) {
      return;
    }
    this.locale = culture;

    switch (culture) {
      case "ar": {
        registerLocaleData(localeArabic);
        break;
      }
      case "en": {
        registerLocaleData(localeEnglish);
        break;
      }
    }
  }

  /*** translate elements without langg directive: ***/
  translateWithoutDerctive() {

    // translate runtime elements:
    this._words = words.default;
    let runTimeElements = document.querySelectorAll(
      "span.title.subtitle, nb-select-label, nb-option.ng-star-inserted, span.info, span.tab-text, div.user-name"
    );
    let runTimeElementsArray = Array.prototype.slice.call(runTimeElements);
    let lastElementsArray = this.elementsArray.value;
    if (lastElementsArray.length != runTimeElementsArray.lenght) {
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

    // translate placeholders for input elements:
    let runTimePlacholders = document.querySelectorAll("input.search-input");
    let runTimePlacholdersArray = Array.prototype.slice.call(
      runTimePlacholders
    );
    let lastPlacholdersArray = this.placholdersArray.value;
    if (lastPlacholdersArray.length != runTimePlacholdersArray.length) {
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
      this.placholdersArray.next(runTimePlacholdersArray);
    }
  }
}
