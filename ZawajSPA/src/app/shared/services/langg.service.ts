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
}
