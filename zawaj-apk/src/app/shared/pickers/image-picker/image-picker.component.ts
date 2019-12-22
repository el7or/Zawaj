import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Capacitor, CameraSource, CameraResultType, Plugins } from '@capacitor/core';
const { Camera } = Plugins;

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent implements OnInit {
  //@ViewChild('filePicker',{static:false}) filePickerRef: ElementRef<HTMLInputElement>;
  @Output() imagePick = new EventEmitter<string>();
  //@Input() showPreview = true;
  selectedImage: string;
  usePicker = false;

  constructor(private platform: Platform) {}

  ngOnInit() {
    /* console.log('Mobile:', this.platform.is('mobile'));
    console.log('Hybrid:', this.platform.is('hybrid'));
    console.log('iOS:', this.platform.is('ios'));
    console.log('Android:', this.platform.is('android'));
    console.log('Desktop:', this.platform.is('desktop'));
    if (
      (this.platform.is('mobile') && !this.platform.is('hybrid')) ||
      this.platform.is('desktop')
    ) {
      this.usePicker = true;
    } */
  }

  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri
    });
    // image.webPath will contain a path that can be set as an image src. 
    // You can access the original file using image.path, which can be 
    // passed to the Filesystem API to read the raw data of the image, 
    // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
    var imageUrl = image.webPath;
    // Can be set to the src of an image now
    this.selectedImage = imageUrl;
  }

  onPickImage(type:string) {
    if (!Capacitor.isPluginAvailable('Camera')) {
      //this.filePickerRef.nativeElement.click();
      return;
    }
    Plugins.Camera.getPhoto({
      quality: 50,
      source: type=='camera'? CameraSource.Camera:CameraSource.Photos,
      correctOrientation: true,
      //height: 320,
      width: 600,
      resultType: CameraResultType.Base64
    })
      .then(image => {
        this.selectedImage = 'data:image/jpeg;base64,' + image.base64String;
        this.imagePick.emit(this.selectedImage);
        console.log('########### '+this.selectedImage);
      })
      .catch(error => {
        console.log(error);
        /* if (this.usePicker) {
          this.filePickerRef.nativeElement.click();
        } */
        return false;
      });
  }

  onSaveImage(){

  }

  /* onFileChosen(event: Event) {
    const pickedFile = (event.target as HTMLInputElement).files[0];
    if (!pickedFile) {
      return;
    }
    const fr = new FileReader();
    fr.onload = () => {
      const dataUrl = fr.result.toString();
      this.selectedImage = dataUrl;
      this.imagePick.emit(pickedFile);
    };
    fr.readAsDataURL(pickedFile);
  } */

}
