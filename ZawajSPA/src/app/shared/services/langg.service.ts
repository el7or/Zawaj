import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Title } from '@angular/platform-browser';


@Injectable({
  providedIn: 'root'
})
export class LanggService {
  
  language = new BehaviorSubject<string>(localStorage.getItem('langg')=='en'?'en':'ar');
  lang = this.language.asObservable();
  constructor(titleService: Title) {
    this.lang.subscribe(
      lang=>{
        if(lang == 'en'){
          localStorage.setItem('langg','en');
          titleService.setTitle('Zawaj');
        }else{
          localStorage.setItem('langg','ar');
          titleService.setTitle('موقع زواج');
        }
      }
    );
   }
}
