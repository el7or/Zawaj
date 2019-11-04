import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  unreadMessages = new BehaviorSubject<number>(3);

  constructor() { }
}
