import { UserDetails } from './../../shared/models/user-details';
import { ActivatedRoute } from '@angular/router';
import { PhotoService } from "./../../shared/services/photo.service";
import { PhotoDetails } from "./../../shared/models/photo-details";
import {
  Component,
  OnInit,
  Input,
  AfterViewInit,
  ViewChild
} from "@angular/core";
import { FileUploader } from "ng2-file-upload";
import { environment } from "../../../environments/environment";
import { AuthService } from "../../shared/services/auth.service";
import { SwalComponent } from "@sweetalert2/ngx-sweetalert2";
import { NbToastrService } from "@nebular/theme";

@Component({
  selector: "photo-editor",
  templateUrl: "./photo-editor.component.html",
  styleUrls: ["./photo-editor.component.scss"]
})
export class PhotoEditorComponent implements OnInit, AfterViewInit {
  @Input() photos: PhotoDetails[];
  @ViewChild("confirmSwal", { static: false }) confirmSwal: SwalComponent;
  @ViewChild("doneSwal", { static: false }) doneSwal: SwalComponent;
  uploader: FileUploader;
  baseUrl = environment.API_URL + "photos/";
  hasBaseDropZoneOver: boolean = false;
  loading = false;
  loadingPhoto = false;
  userDetails:UserDetails;

  constructor(
    private authService: AuthService,
    private photoService: PhotoService,
    private toastrService: NbToastrService,
    private route:ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.userDetails = data.userDetails;
    });

    this.uploader = new FileUploader({
      url: this.baseUrl + this.authService.currentUserId,
      authToken: "Bearer " + localStorage.getItem("token"),
      isHTML5: true,
      allowedFileType: ["image"],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });
    this.uploader.onProgressItem = () => {
      this.loading = true;
    };
    this.uploader.onSuccessItem = (item, response) => {
      let addedPhoto: PhotoDetails = JSON.parse(response);
      this.photos.push(addedPhoto);
      this.loading = false;
      this.doneSwal.fire();
    };
  }

  ngAfterViewInit() {
    this.uploader.onAfterAddingFile = item => {
      item.withCredentials = false;
    };
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  setMainPhoto(photo: PhotoDetails) {
    this.loadingPhoto = true;
    this.photoService.setMainPhoto(photo.id).subscribe(
      () => {
        let currentMain = this.photos.filter(p => p.isMain === true)[0];
        currentMain.isMain = false;
        photo.isMain = true;
        this.userDetails.photoURL = photo.url;
        this.authService.currentUserPhoto=photo.url;
        localStorage.setItem('userPhoto',photo.url);
        this.loadingPhoto = false;
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
    /* this.userService.setMainPhoto(this.authService.decodedToken.nameid,photo.id).subscribe(
      ()=>{this.currentMain=this.photos.filter(p=>p.isMain===true)[0];
      this.currentMain.isMain=false;
      photo.isMain=true;
      // this.getMemberPhotoChange.emit(photo.url);
      // this.user.photoURL= photo.url;
      this.authService.changeMemberPhoto(photo.url);
      this.authService.currentUser.photoURL=photo.url;
      localStorage.setItem('user',JSON.stringify(this.authService.currentUser));
      
      },
      ()=>{this.alertify.error('يوجد مشكلة في الصورة الأساسية');}
    ) */
  }

  delete(id: number) {
    this.confirmSwal.fire().then(result => {
      if (result.value) {
        this.loadingPhoto = true;
        this.photoService.deletePhoto(id).subscribe(
          () => {
            this.photos.splice(this.photos.findIndex(p => p.id === id), 1);
            this.loadingPhoto = false;
            this.doneSwal.fire();
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
    });
  }
}
