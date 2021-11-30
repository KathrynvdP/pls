import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AlertController, LoadingController, NavParams, ModalController, ActionSheetController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { LoadingService } from '../services/loading.service';
import { Storage } from '@ionic/storage';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { ToastService } from '../services/toast.service';
import { finalize } from 'rxjs/operators';
import { UUID } from 'angular2-uuid';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.page.html',
  styleUrls: ['./edit-account.page.scss'],
})
export class EditAccountPage implements OnInit {

  user = {
    key: '', date: '', time: '', name: '', surname: '', type: '', photo: '', code: '', fleet: '', fleetNo: '', info: '', email: '', password: '',
  };

  params;
  data;

  trucks = [];
truck; 

  showCrop = false;
  cropImageInput: any;
  cropImageOutput: any;

  allowdedFileExtentions = '';

  fileTypes: any = [];
  permittedFileTypes: any = [];
  photos = [];

  imageChangedEvent: any = '';

  downloadURL: Observable<string | null>;

  @ViewChild('imageChooser', { static: false }) filePickerRef: ElementRef<HTMLInputElement>;

  constructor(public toast: ToastService, private afStorage: AngularFireStorage, private camera: Camera, public alertCtrl: AlertController, private afs: AngularFirestore,
    public loading: LoadingService, public modalCtrl: ModalController, private storage: Storage, public navParams: NavParams,
    public actionSheetController: ActionSheetController, public alertController: AlertController, public router: Router) {
    this.params = navParams.data;
  }

  ngOnInit() {
    this.user.key = this.params.key;
    this.afs.collection('users').doc(this.user.key).ref.get().then((user: any) => {
      this.data = user.data();
      if (this.data) {
        this.user = this.data;
      }
      if (this.user.type === 'Driver') {
        this.afs.collection('trucks').ref.orderBy('fleetNo').get().then(trucks => {
          trucks.forEach((truck: any) => {
            this.trucks.push({ registration: truck.data().registration, fleet: truck.data().fleet, fleetNo: truck.data().fleetNo });
          });
        });      
      }
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

      let photo = this.afStorage.ref(`/users/${this.user.key}/${imageID}.jpeg`);

      photo.putString(imageData, 'base64', metadata).then(snapshot => {
        const ref = this.afStorage.ref(`/users/${this.user.key}/${imageID}.jpeg`);
        this.downloadURL = ref.getDownloadURL();
        this.downloadURL.subscribe(url => {
          if (url) {
            if (this.user.photo === '') {
              this.user.photo = url;
              this.photos.push({ image: this.user.photo, name: 'Photo' })
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

      const filePath = `/users/${this.user.key}/${file.name}`;
      const fileRef = this.afStorage.ref(filePath);
      const task = this.afStorage.upload(filePath, file);

      // get notified when the download URL is available
      task.snapshotChanges().pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe(url => {
            if (url) {
              if (this.user.photo === '') {
                this.user.photo = url;
                this.photos.push({ image: this.user.photo, name: 'Photo' })
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
      this.user.photo = '';
    }
    for (var i = 0; i < this.photos.length; i++) {
      if (this.photos[i].name === photo.name) {
        this.photos.splice(i, 1);
      }
    }
  }

  update() {
    this.loading.present('Saving, Please Wait...').then(() => {
      this.afs.collection('users').doc(this.user.key).update(this.user).then(() => {
        if (this.user.type === 'Driver') {
          this.afs.collection('users').doc(this.user.key).update({ truck: this.truck.registration })
        }
        this.storage.remove('user').then(() => {
          this.storage.set('user', this.user);
          this.modalCtrl.dismiss();
          this.loading.dismiss();
        });
      })
    });
  }

  close() {
    this.modalCtrl.dismiss();
  }

}
