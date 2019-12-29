import { PhotoService } from "./../photo.service";
import { AuthService } from "./../../../../auth/auth.service";
import { Photo } from "./../photo.model";
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
  Input
} from "@angular/core";
import { Platform, ToastController } from "@ionic/angular";
import {
  Capacitor,
  CameraSource,
  CameraResultType,
  Plugins
} from "@capacitor/core";
const { Camera } = Plugins;

function base64toBlob(base64Data, contentType) {
  contentType = contentType || "";
  const sliceSize = 1024;
  const byteCharacters = window.atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
}

@Component({
  selector: "app-image-picker",
  templateUrl: "./image-picker.component.html",
  styleUrls: ["./image-picker.component.scss"]
})
export class ImagePickerComponent implements OnInit {
  @ViewChild("filePicker", { static: false }) filePickerRef: ElementRef<
    HTMLInputElement
  >;
  selectedImage: string;
  imagePick: string | File;
  usePicker = false;
  @Input() photos: Photo[];
  isLoading = false;

  constructor(
    private platform: Platform,
    private authService: AuthService,
    private photoService: PhotoService,
     private toastCtrl:ToastController
  ) {}

  ngOnInit() {
    /* console.log("Mobile:", this.platform.is("mobile"));
    console.log("Hybrid:", this.platform.is("hybrid"));
    console.log("iOS:", this.platform.is("ios"));
    console.log("Android:", this.platform.is("android"));
    console.log("Desktop:", this.platform.is("desktop")); */
    if (
      (this.platform.is("mobile") && !this.platform.is("hybrid")) ||
      this.platform.is("desktop")
    ) {
      this.usePicker = true;
    }
  }

  /* async takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri
    });
    var imageUrl = image.webPath;
    this.selectedImage = imageUrl;
  } */

  onPickImage(type: string) {
    if (!Capacitor.isPluginAvailable("Camera")) {
      this.filePickerRef.nativeElement.click();
      return;
    }
    Plugins.Camera.getPhoto({
      quality: 50,
      source: type == "camera" ? CameraSource.Camera : CameraSource.Photos,
      correctOrientation: true,
      //height: 320,
      width: 600,
      resultType: CameraResultType.Base64
    })
      .then(image => {
        this.selectedImage = "data:image/jpeg;base64," + image.base64String;
        this.imagePick = this.selectedImage;
      })
      .catch(error => {
        console.log(error);
        if (this.usePicker) {
          this.filePickerRef.nativeElement.click();
        }
        return false;
      });
  }

  onSaveImage() {
    this.isLoading = true;
    let imageFile;
    if (typeof this.imagePick === "string") {
      try {
        imageFile = base64toBlob(
          this.imagePick.replace("data:image/jpeg;base64,", ""),
          "image/jpeg"
        );
      } catch (error) {
        console.log(error);
        return;
      }
    } else {
      imageFile = this.imagePick;
    }
    this.photoService
      .addPhoto(this.authService.currentUserId, imageFile)
      .subscribe(
        (response: Photo) => {
          this.photos.push(response);
          this.isLoading = false;
          this.toastCtrl
            .create({
              message:
                '<ion-icon name="checkmark" size="large"></ion-icon> تم إضافة الصورة بنجاح <ion-icon name="checkmark" size="large"></ion-icon>',
              duration: 3000,
              color: "success"
            })
            .then(toastEl => toastEl.present());
        },
        err => {
          console.error(err);
        }
      );
    this.selectedImage = null;
  }

  onFileChosen(event: Event) {
    const pickedFile = (event.target as HTMLInputElement).files[0];
    if (!pickedFile) {
      return;
    }
    const fr = new FileReader();
    fr.onload = () => {
      const dataUrl = fr.result.toString();
      this.selectedImage = dataUrl;
      this.imagePick = pickedFile;
    };
    fr.readAsDataURL(pickedFile);
  }

  onCancelImage(){
    this.selectedImage = null;
    this.imagePick = null;
    this.filePickerRef.nativeElement.value = null;
  }
}
