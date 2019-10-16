import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Title } from "@angular/platform-browser";
import { registerLocaleData } from '@angular/common';
// @ts-ignore
import * as words from "../../../assets/locale/translation.json";
import localeArabic from '@angular/common/locales/ar';
import localeEnglish from '@angular/common/locales/en';
import { NbLayoutDirectionService, NbLayoutDirection } from '@nebular/theme';

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
  langLoading = new BehaviorSubject<boolean>(false);

  constructor(titleService: Title, private dirService: NbLayoutDirectionService) {
    this.lang.subscribe(lang => {
      if (lang == "en") {
        localStorage.setItem("langg", "en");
        titleService.setTitle("Zawaj");
        if (this.dirService.isRtl) {
          this.dirService.setDirection(NbLayoutDirection.LTR);
        }
      } else {
        localStorage.setItem("langg", "ar");
        titleService.setTitle("موقع زواج");
        if (this.dirService.isLtr) {
          this.dirService.setDirection(NbLayoutDirection.RTL);
        }
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


  private _locale: string;

    set locale(value: string) {
        this._locale = value;
    }
    get locale(): string {
        return localStorage.getItem('langg') || 'ar';
    }

    registerCulture(culture: string) {
        if (!culture) {
            return;
        }
        this.locale = culture;

        switch (culture) {
            case 'ar': {
                registerLocaleData(localeArabic);
                break;
            }
            case 'en': {
                registerLocaleData(localeEnglish);
                break;
            }
        }
    }
}
