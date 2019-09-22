import { LanggService } from './../services/langg.service';
import { Directive, ElementRef, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
// @ts-ignore
import * as words from '../../../assets/locale/translation.json'
import { Subscription } from 'rxjs';

@Directive({
  selector: '[langg]'
})
export class LanggDirective implements OnInit , AfterViewInit, OnDestroy {

  langgSubscription: Subscription
  _words = [];
  constructor(private ref : ElementRef, private langgService:LanggService) {
   }

  ngOnInit() {
    this._words = words.default;
  }
  
  ngAfterViewInit() {
    this.langgSubscription = this.langgService.lang.subscribe(
      lang=>{
        if(lang == 'en'){
          try{
              var word = this._words.filter(word=>word['ar'].match(this.ref.nativeElement.innerText));
              if(word[0]['ar']==this.ref.nativeElement.innerText)
              this.ref.nativeElement.innerText = word[0]['en'];
          }catch{}
        }

        if(lang == 'ar'){
          try{
              var word = this._words.filter(word=>word['en'].match(this.ref.nativeElement.innerText));
              if(word[0]['en']==this.ref.nativeElement.innerText)
              this.ref.nativeElement.innerText = word[0]['ar'];
          }catch{}
        }
      }
    )
  }

  ngOnDestroy(){
    this.langgSubscription.unsubscribe();
  }

}
