import { PhotoDetails } from './../../shared/models/photo-details';
import { Component, OnInit, Input } from '@angular/core';
import { FileUploader, FileSelectDirective, FileDropDirective } from 'ng2-file-upload';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.scss']
})
export class PhotoEditorComponent implements OnInit {
  @Input() photos: PhotoDetails[]
  uploader:FileUploader;
  baseUrl = environment.API_URL + "photos/";
  hasBaseDropZoneOver:boolean = false;
 
  constructor() { }

  ngOnInit() {
    this.uploader= new FileUploader({url: this.baseUrl,isHTML5: true});
  }
  
  public fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }

  setMainPhoto(photo:PhotoDetails){
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

  delete(id:number){
    /* this.alertify.confirm("هل تريد حذف تلك الصورة",()=>{
      this.userService.deletePhoto(this.authService.decodedToken.nameid,id).subscribe(
        ()=>{
          this.photos.splice(this.photos.findIndex(p=>p.id===id),1);
          this.alertify.success("تم حذف الصورة بنجاح");
        },
        error=>{this.alertify.error("حدث خطأ أثناء حذف الصورة");}

      );
    }); */
  }

}
