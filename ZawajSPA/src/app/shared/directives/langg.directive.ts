import { LanggService } from "./../services/langg.service";
import {
  Directive,
  ElementRef,
  OnInit,
  AfterViewInit,
  OnDestroy,
  AfterViewChecked
} from "@angular/core";
// @ts-ignore
import * as words from "../../../assets/locale/translation.json";
import { Subscription } from "rxjs";

@Directive({
  selector: "[langg]"
})
export class LanggDirective
  implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {
  langgSubscription: Subscription;
  _words = [];
  constructor(private ref: ElementRef, private langgService: LanggService) {}

  ngOnInit() {
    this._words = words.default;
  }

  ngAfterViewInit() {
    this.langgSubscription = this.langgService.lang.subscribe(lang => {
      try {
        if (this.ref.nativeElement.hasAttribute("placeholder")) {
          let words = this._words.filter(o =>
            Object.keys(o).some(k => o[k] == this.ref.nativeElement.getAttribute("placeholder")));
          this.ref.nativeElement.setAttribute("placeholder", words[0][lang]);
        }
        let words = this._words.filter(o =>
          Object.keys(o).some(k => o[k]==this.ref.nativeElement.innerText)
        );
        this.ref.nativeElement.innerText = words[0][lang];
      } catch {}
    });
  }

  ngAfterViewChecked() {
    /* let elementClass: Boolean = this.ref.nativeElement.classList.contains(
      "ng-star-inserted"
    );
    if (elementClass) {
      this.langgSubscription = this.langgService.lang.subscribe(lang => {
        try {
          let words = this._words.filter(o =>
            Object.keys(o).some(k => o[k] == this.ref.nativeElement.innerText)
          );
          this.ref.nativeElement.innerText = words[0][lang];
        } catch {}
      });
    } */
  }

  ngOnDestroy() {
    this.langgSubscription.unsubscribe();
  }
}
