import { NbToastrService } from '@nebular/theme';
import { AuthService } from './../../shared/services/auth.service';
import { LikeService } from './../../shared/services/like.service';
import { Component, OnInit } from '@angular/core';
import { LikeList } from '../../shared/models/like-list';
import { LikeUser } from '../../shared/models/like-user';

@Component({
  selector: 'likes',
  templateUrl: './likes.component.html',
  styleUrls: ['./likes.component.scss']
})
export class LikesComponent implements OnInit {
  isLikesFrom = false;
  likesData: LikeList[];

  constructor(private likeService:LikeService, private authService:AuthService,
    private toastrService:NbToastrService) { }

  ngOnInit() {
    this.likeService.getLikes(this.authService.currentUserId,this.isLikesFrom).subscribe(
      res => this.likesData = res,
      err=>console.error(err)
    );
  }

  reloadLikes(isLikesFrom){
    this.likeService.getLikes(this.authService.currentUserId,isLikesFrom).subscribe(
      res => this.likesData = res,
      err=>console.error(err)
    );
  }

  dislike(likeToUserId: string,index: number) {
      let deletedLike: LikeUser = {
        likeFromUserId: this.authService.currentUserId,
        likeToUserId: likeToUserId
      };
      this.likeService.deleteLike(deletedLike).subscribe(
        () => {
          this.likesData.splice(index, 1);
          this.toastrService.danger(
            "Removed from likes list successfully.",
            "Success!",
            { duration: 3000 }
          );
        },
        error => {
          console.error(error);
          this.toastrService.warning(
            "Please refresh page and try again.",
            "Something Wrong!",
            { duration: 3000 }
          );
        }
      );
  }

}
