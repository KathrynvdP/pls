import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AlertController, ModalController, ActionSheetController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { LoadingService } from '../services/loading.service';
import { dismantleLicDisk } from '../utils/utility';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { UUID } from 'angular2-uuid';
import { ToastService } from '../services/toast.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.page.html',
  styleUrls: ['./add-item.page.scss'],
})
export class AddItemPage implements OnInit {

  code;

  item = {
    code: '', type: '', registration: '', checkType: 'Large', colour: '', licence: '',
    photo: '', photo1: '', photo2: '', photo3: '', photo4: '', photo5: '', photo6: '', photo7: '', photo8: '', photo9: '',
    km: '', driver: '', model: '', engineNo: '', vinNo: '', jobNo: '', timeStamp: '',
    make: '', desc: '', fleet: '', fleetNo: '',
  };

  drivers = [];
  driver = false;

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

  constructor(public toast: ToastService, private afStorage: AngularFireStorage, private camera: Camera, private barcodeScanner: BarcodeScanner, public alertCtrl: AlertController, private afs: AngularFirestore,
    public loading: LoadingService, public modalCtrl: ModalController, private storage: Storage,
    public actionSheetController: ActionSheetController, public alertController: AlertController) {
  }

  ngOnInit() {
  }

  scan() {
    this.barcodeScanner.scan({
      showTorchButton: true,
      showFlipCameraButton: true,
      formats: 'QR_CODE,PDF_417'
    }).then(barcodeData => {
      this.item.code = dismantleLicDisk(barcodeData).RegNum;
      this.item.registration = dismantleLicDisk(barcodeData).RegNum;
      this.item.colour = dismantleLicDisk(barcodeData).carColour;
      this.item.make = dismantleLicDisk(barcodeData).carMake;
      this.item.model = dismantleLicDisk(barcodeData).carModel;
      this.item.desc = dismantleLicDisk(barcodeData).carType;
      this.item.engineNo = dismantleLicDisk(barcodeData).engineNum;
      this.item.vinNo = dismantleLicDisk(barcodeData).vinNum;
    });
  }

  checkType() {
    if (this.item.type === 'Truck') {
      this.afs.collection('users').ref.where('type', '==', 'driver').get().then(drivers => {
        drivers.forEach(driver => {
          this.drivers.push(driver.data());
        });
        this.driver = true;
      });
    }
  }

  checkFleet() {
    this.afs.collection(this.item.type).ref.where('fleetNo', '==', this.item.fleetNo).get().then(trucks => {
      if (trucks.size > 0) {
        this.fleetAlert()
      } else {
      }
    })
  }

  async fleetAlert() {
    const prompt = await this.alertCtrl.create({
      header: 'Invalid Fleet Number',
      message: `This fleet number has already been used for another vehicle. Please enter another fleet number.`,
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

  check() {
    if (this.item.type !== '') {
      if (this.item.registration !== '') {
        if (this.item.checkType !== '') {
          if (this.item.colour !== '') {
            this.save();
          } else {
            this.alertMsg('Colour');
          }
        } else {
          this.alertMsg('Check Level');
        }
      } else {
        this.alertMsg('Registration');
      }
    } else {
      this.alertMsg('Type');
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

      this.setCode();

      if (this.item.type === 'trucks') {
        this.afs.collection('trucks').doc(this.item.code).set(this.item);
        this.afs.collection('codes').doc(this.item.code).set({
          code: this.item.code,
          type: 'trucks'
        });
      } else if (this.item.type === 'trailers') {
        this.afs.collection('trailers').doc(this.item.code).set(this.item);
        this.afs.collection('codes').doc(this.item.code).set({
          code: this.item.code,
          type: 'trailers'
        });
      }
      this.modalCtrl.dismiss();
      this.loading.dismiss();
    });
  }

  setCode() {
    this.afs.collection('codes').doc(this.item.code).set({
      code: this.item.code,
      type: this.item.type
    });
  }

}
