import { BehaviorSubject } from 'rxjs';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent  {
  users: { name: string, title: string }[] = [
    { name: 'Carla Espinosa', title: 'Nurse' },
    { name: 'Bob Kelso', title: 'Doctor of ' },
    { name: 'Janitor', title: 'Janitor' },
    { name: 'Perry Cox', title: 'Doctor ' },
    { name: 'Ben Sullivan', title: 'Carpenter ' },
  ];
  messages=[
    {
      text: 'Success!',
      date: new Date(),
      reply: false,
      user: {
        name: 'صفوى',
        avatar: 'https://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-12/256/robot-face.png',
      },
    },
  ];

  /* constructor(protected chatShowcaseService: ChatShowcaseService) {
    this.messages = this.chatShowcaseService.loadMessages();
  } */

  openChat(){
    alert(1111111);
  }

  sendMessage(event: any) {
    this.messages.push({
      text: event.message,
      date: new Date(),
      reply: true,
      user: {
        name: 'محمود',
        avatar: 'https://i.gifer.com/no.gif',
      },
    });
    /* const botReply = this.chatShowcaseService.reply(event.message);
    if (botReply) {
      setTimeout(() => { this.messages.push(botReply) }, 500);
    } */
  }

}
