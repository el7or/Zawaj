import { Location } from '@angular/common';
import { UserDetails } from "./../../shared/models/user-details";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  NgxGalleryOptions,
  NgxGalleryImage,
  NgxGalleryAnimation
} from "ngx-gallery";
import { AuthService } from '../../shared/services/auth.service';
import { LikeService } from '../../shared/services/like.service';
import { LanggService } from '../../shared/services/langg.service';
import { NbToastrService } from '@nebular/theme';
import { LikeUser } from '../../shared/models/like-user';
import { LanggPipe } from '../../shared/pipes/langg.pipe';

@Component({
  selector: "member-details",
  templateUrl: "./member-details.component.html",
  styleUrls: ["./member-details.component.scss"]
})
export class MemberDetailsComponent implements OnInit {
  userDetails: UserDetails;
  showIntro: boolean = true;
  showLook: boolean = true;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  constructor(
    private authService: AuthService,
    private likeService: LikeService,
    private langgService:LanggService,
    private route: ActivatedRoute,
    private router: Router,
    private toastrService: NbToastrService, private location: Location) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.userDetails = data.userDetails;
    });

    this.galleryOptions = [
      {
        width: "100%",
        height: "500px",
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        previewCloseOnEsc: true,
        previewKeyboardNavigation: true
      },
      // max-width 800
      {
        breakpoint: 800,
        width: "100%",
        height: "600px",
        imagePercent: 80,
        thumbnailsPercent: 20,
        thumbnailsMargin: 20,
        thumbnailMargin: 20
      },
      // max-width 400
      {
        breakpoint: 400,
        preview: false
      }
    ];
    this.galleryImages = this.userDetails.photos.map(photo => {
      return {
        small: photo.url,
        medium: photo.url,
        big: photo.url
      };
    });
    this.location.replaceState('pages/'+'members');
  }

  like(likeToUserId: string) {
    if (!this.authService.isAuthenticated()) {
      this.authService.redirectUrl = this.router.url;
      this.router.navigate(["/auth/login"]);
    } else {
      let newLike: LikeUser = {
        likeFromUserId: this.authService.currentUserId,
        likeToUserId: likeToUserId
      };
      this.likeService.postLike(newLike).subscribe(
        () => {
          this.toastrService.danger(
            new LanggPipe(this.langgService).transform("Added to likes list successfully."),
            new LanggPipe(this.langgService).transform("Success!"),
            { duration: 3000 }
          );
        },
        error => {
          console.error(error);
          this.toastrService.warning(
            new LanggPipe(this.langgService).transform("Please refresh page and try again."),
            new LanggPipe(this.langgService).transform("Something Wrong!"),
            { duration: 3000 }
          );
        }
      );
    }
  }
  dislike(likeToUserId: string) {
    if (!this.authService.isAuthenticated()) {
      this.authService.redirectUrl = this.router.url;
      this.router.navigate(["/auth/login"]);
    } else {
      let deletedLike: LikeUser = {
        likeFromUserId: this.authService.currentUserId,
        likeToUserId: likeToUserId
      };
      this.likeService.deleteLike(deletedLike).subscribe(
        () => {
          this.toastrService.danger(
            new LanggPipe(this.langgService).transform("Removed from likes list successfully."),
            new LanggPipe(this.langgService).transform("Success!"),
            { duration: 3000 }
          );
        },
        error => {
          console.error(error);
          this.toastrService.warning(
            new LanggPipe(this.langgService).transform("Please refresh page and try again."),
            new LanggPipe(this.langgService).transform("Something Wrong!"),
            { duration: 3000 }
          );
        }
      );
    }
  }

  goBack(){
this.location.back();
  }
}
