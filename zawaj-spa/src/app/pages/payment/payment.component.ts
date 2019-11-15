import { PaymentService } from './../../shared/services/payment.service';
import {
  Component,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  OnInit
} from "@angular/core";

import { UserService } from "../../shared/services/user.service";
import { AuthService } from "../../shared/services/auth.service";

import { Location } from "@angular/common";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "payment",
  templateUrl: "./payment.component.html",
  styleUrls: ["./payment.component.scss"]
})
export class PaymentComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild("cardInfo", { static: false }) cardInfo: ElementRef;

  card: any;
  cardHandler = this.onChange.bind(this);
  error: string;
  successPaid: boolean = false;
  loader: boolean = false;

  constructor(
    private cd: ChangeDetectorRef,
    private userService: UserService,
    public authService: AuthService,
    private paymentService:PaymentService,
    private location: Location,
    private route: ActivatedRoute
  ) {}

  ngAfterViewInit() {
    const style = {
      base: {
        fontFamily: "monospace",
        fontSmoothing: "antialiased",
        fontSize: "21px",
        "::placeholder": {
          color: "purple"
        }
      }
    };

    this.card = elements.create("card", { hidePostalCode: true, style: style });
    this.card.mount(this.cardInfo.nativeElement);
    // this.card.mount('#card-info');

    this.card.addEventListener("change", this.cardHandler);
  }

  ngOnDestroy() {
    this.card.removeEventListener("change", this.cardHandler);
    this.card.destroy();
  }

  onChange({ error }) {
    if (error) {
      this.loader = false;
      if (error.message === "Your card number is incomplete.")
        this.error = "رقم بطاقتك غير صحيح";
      if (error.message === "Your card's expiration date is incomplete.")
        this.error = "تاريخ إنتهاء البطاقة غير صحيح";
      if (error.message === "Your card's security code is incomplete.")
        this.error = "كود الحماية غير صحيح";
    } else {
      this.error = null;
    }
    this.cd.detectChanges();
  }

  ngOnInit() {}
  async onSubmit() {
    const { token, error } = await stripe.createToken(this.card);

    if (error) {
      console.log("حدث خطأ في السداد", error);
    } else {
      this.paymentService
        .charge(this.authService.currentUserId, token.id.toString())
        .subscribe((res:boolean) => {
          this.successPaid = res;
          setTimeout(() => {
            this.paymentService.paid = res;
          }, 2000);
        });
    }
  }
  goBack() {
    this.location.back();
  }
  load() {
    if (this.error === null) this.loader = true;
    else this.loader = false;
  }
}
