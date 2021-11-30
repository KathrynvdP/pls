import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavParams, AlertController, ModalController, ActionSheetController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { UUID } from 'angular2-uuid';
import { ToastService } from '../services/toast.service';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-update-item',
  templateUrl: './update-item.page.html',
  styleUrls: ['./update-item.page.scss'],
})
export class UpdateItemPage implements OnInit {

  params;
  type;
  code;

  item: any = {};

  showCrop = false;
  cropImageInput: any;
  cropImageOutput: any;

  allowdedFileExtentions = '';

  fileTypes: any = [];
  permittedFileTypes: any = [];
  photos = [];

  imageChangedEvent: any = '';

  downloadURL: Observable<string | null>;

  drivers = [];

  @ViewChild('imageChooser', { static: false }) filePickerRef: ElementRef<HTMLInputElement>;

  constructor(public navParams: NavParams, private storage: Storage, private afs: AngularFirestore, private camera: Camera, private afStorage: AngularFireStorage, public loading: LoadingService, public toast: ToastService, public alertCtrl: AlertController, public modalCtrl: ModalController, public actionSheetController: ActionSheetController) {
    this.params = navParams.data;
  }

  ngOnInit() {
    this.type = this.params.type;
    this.code = this.params.code;
    this.afs.collection(this.type).doc(this.code).ref.get().then(vehicle => {
      var data = vehicle.data()
      if (data) {
        this.item = data;
      }
    })
    this.afs.collection('users').ref.where('type', '==', 'driver').get().then(drivers => {
      drivers.forEach(driver => {
        this.drivers.push(driver.data());
      });
    });
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      mode: 'ios',
      header: 'Image Source',
      buttons: [{
        text: 'Camera',
        icon: 'camera',
        handler: () => {
          this.takePicture();
        }
      },
      {
        text: 'Attachments',
        icon: 'attach-outline',
        handler: () => {
          this.filePickerRef.nativeElement.click();
        }
      }]
    });
    await actionSheet.present();
  }

  // Open Camera Option
  // Return Image as Base64 String

  async takePicture() {
    const options: CameraOptions = {
      quality: 90,
      targetWidth: 300,
      targetHeight: 300,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {

      this.loading.present('Uploading...');

      var metadata = {
        contentType: 'image/jpeg',
      }
      const imageID = UUID.UUID();

      let photo = this.afStorage.ref(`/vehicles/${this.item.code}/${imageID}.jpeg`);

      photo.putString(imageData, 'base64', metadata).then(snapshot => {
        const ref = this.afStorage.ref(`/vehicles/${this.item.code}/${imageID}.jpeg`);
        this.downloadURL = ref.getDownloadURL();
        this.downloadURL.subscribe(url => {
          if (url) {
            if (this.item.photo === '') {
              this.item.photo = url;
              this.photos.push({ image: this.item.photo, name: 'Photo 1' })
            }
            else if (this.item.photo1 === '') {
              this.item.photo1 = url;
              this.photos.push({ image: this.item.photo1, name: 'Photo 2' })
            }
            else if (this.item.photo2 === '') {
              this.item.photo2 = url;
              this.photos.push({ image: this.item.photo2, name: 'Photo 3' })
            }
            else if (this.item.photo3 === '') {
              this.item.photo3 = url;
              this.photos.push({ image: this.item.photo3, name: 'Photo 4' })
            }
            else if (this.item.photo4 === '') {
              this.item.photo4 = url;
              this.photos.push({ image: this.item.photo4, name: 'Photo 5' })
            }
            else if (this.item.photo5 === '') {
              this.item.photo5 = url;
              this.photos.push({ image: this.item.photo5, name: 'Photo 6' })
            }
            else if (this.item.photo6 === '') {
              this.item.photo6 = url;
              this.photos.push({ image: this.item.photo6, name: 'Photo 7' })
            }
            else if (this.item.photo7 === '') {
              this.item.photo7 = url;
              this.photos.push({ image: this.item.photo7, name: 'Photo 8' })
            }
            else if (this.item.photo8 === '') {
              this.item.photo8 = url;
              this.photos.push({ image: this.item.photo8, name: 'Photo 9' })
            }
            else if (this.item.photo9 === '') {
              this.item.photo9 = url;
              this.photos.push({ image: this.item.photo9, name: 'Photo 10' })
            }
            this.loading.dismiss().then(() => {
              this.toast.show('Photo uploaded Successfully!')
            })
          }
        })
      })
    })
  }
  // File selector
  // To do: Error msg on incorrect file type
  onChooseFile(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];

    const reader = new FileReader();

    reader.onload = () => {

      this.loading.present('Uploading...');

      const filePath = `/vehicles/${this.item.code}/${file.name}`;
      const fileRef = this.afStorage.ref(filePath);
      const task = this.afStorage.upload(filePath, file);

      // get notified when the download URL is available
      task.snapshotChanges().pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe(url => {
            if (url) {
              if (this.item.photo === '') {
                this.item.photo = url;
                this.photos.push({ image: this.item.photo, name: 'Photo 1' })
              }
              else if (this.item.photo1 === '') {
                this.item.photo1 = url;
                this.photos.push({ image: this.item.photo1, name: 'Photo 2' })
              }
              else if (this.item.photo2 === '') {
                this.item.photo2 = url;
                this.photos.push({ image: this.item.photo2, name: 'Photo 3' })
              }
              else if (this.item.photo3 === '') {
                this.item.photo3 = url;
                this.photos.push({ image: this.item.photo3, name: 'Photo 4' })
              }
              else if (this.item.photo4 === '') {
                this.item.photo4 = url;
                this.photos.push({ image: this.item.photo4, name: 'Photo 5' })
              }
              else if (this.item.photo5 === '') {
                this.item.photo5 = url;
                this.photos.push({ image: this.item.photo5, name: 'Photo 6' })
              }
              else if (this.item.photo6 === '') {
                this.item.photo6 = url;
                this.photos.push({ image: this.item.photo6, name: 'Photo 7' })
              }
              else if (this.item.photo7 === '') {
                this.item.photo7 = url;
                this.photos.push({ image: this.item.photo7, name: 'Photo 8' })
              }
              else if (this.item.photo8 === '') {
                this.item.photo8 = url;
                this.photos.push({ image: this.item.photo8, name: 'Photo 9' })
              }
              else if (this.item.photo9 === '') {
                this.item.photo9 = url;
                this.photos.push({ image: this.item.photo9, name: 'Photo 10' })
              }
              this.loading.dismiss().then(() => {
                this.toast.show('Photo Uploaded Successfully!')
              })
            }
          })
        })
      ).subscribe()

    };

    reader.readAsDataURL(file);

  }

  removeImage(photo) {
    if (photo.name === 'Photo 1') {
      this.item.photo = '';
    }
    if (photo.name === 'Photo 2') {
      this.item.photo1 = '';
    }
    if (photo.name === 'Photo 3') {
      this.item.photo2 = '';
    }
    if (photo.name === 'Photo 4') {
      this.item.photo3 = '';
    }
    if (photo.name === 'Photo 5') {
      this.item.photo4 = '';
    }
    if (photo.name === 'Photo 6') {
      this.item.photo5 = '';
    }
    if (photo.name === 'Photo 7') {
      this.item.photo6 = '';
    }
    if (photo.name === 'Photo 8') {
      this.item.photo7 = '';
    }
    if (photo.name === 'Photo 9') {
      this.item.photo8 = '';
    }
    if (photo.name === 'Photo 10') {
      this.item.photo9 = '';
    }
    for (var i = 0; i < this.photos.length; i++) {
      if (this.photos[i].name === photo.name) {
        this.photos.splice(i, 1);
      }
    }
  }

  async alertMsg(item) {
    const prompt = await this.alertCtrl.create({
      header: 'Incomplete Item',
      message: `Please complete the following field before saving: ${item}`,
      cssClass: 'alert',
      buttons: [
        {
          text: 'OK',
          handler: data => {
          }
        },
      ]
    });
    return await prompt.present();
  }

  save() {
    this.loading.present('Saving, Please Wait...').then(() => {
      if (this.item.type === 'trucks') {
        this.afs.collection('trucks').doc(this.item.code).update(this.item);
      } else if (this.item.type === 'trailers') {
        this.afs.collection('trailers').doc(this.item.code).update(this.item);
      }
      this.modalCtrl.dismiss();
      this.loading.dismiss();
    });
  }

}
