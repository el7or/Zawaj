import { LanggService } from './../services/langg.service';
import { Directive, ElementRef, OnInit, AfterViewInit, OnDestroy, AfterViewChecked } from '@angular/core';
// @ts-ignore
import * as words from '../../../assets/locale/translation.json'
import { Subscription } from 'rxjs';

@Directive({
  selector: '[langg]'
})
export class LanggDirective implements OnInit , AfterViewInit, AfterViewChecked, OnDestroy { 

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
        try{
          let words = this._words.filter( o => Object.keys(o).some( k=> o[k].match(this.ref.nativeElement.innerText)));
            this.ref.nativeElement.innerText = words[0][lang];
        }catch{}
      }
    )
  }

  ngAfterViewChecked() {
    this.langgSubscription = this.langgService.lang.subscribe(
      lang=>{
        try{
          let words = this._words.filter( o => Object.keys(o).some( k=> o[k].match(this.ref.nativeElement.innerText)));
            this.ref.nativeElement.innerText = words[0][lang];
        }catch{}
      }
    )
  }

  ngOnDestroy(){
    this.langgSubscription.unsubscribe();
  }

}
