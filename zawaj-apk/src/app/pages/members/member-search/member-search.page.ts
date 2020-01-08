import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-member-search",
  templateUrl: "./member-search.page.html",
  styleUrls: ["./member-search.page.scss"]
})
export class MemberSearchPage implements OnInit {
  items: any;

  constructor() {}

  ngOnInit() {
    this.initializeItems();
  }

  initializeItems(){
    this.items = ["Ram","gopi", "dravid"];
    }

  onTyping(event) {
    this.initializeItems();
    const val = event.target.value.toLowerCase();
    if (val && val.trim() != "") {
      this.items = this.items.filter(item => {
        return item.toLowerCase().indexOf(val.toLowerCase()) > -1;
      });
    }
  }
}
