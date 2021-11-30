import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { LoadingService } from '../services/loading.service';
import { Router } from '@angular/router';
import moment from 'moment';
import { UUID } from 'angular2-uuid';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-fuel-record',
  templateUrl: './fuel-record.page.html',
  styleUrls: ['./fuel-record.page.scss'],
})
export class FuelRecordPage implements OnInit {

  fuel = {
    key: '', date: '', time: '', name: '', surname: '', driverKey: '', fleet: '', fleetNo: '', code: '', location: '', station: '', km: '', litre: 0, price: 0, receipt: '',
  };

  trucks = [];
  truck;
  stations = [];
  station;

  imageChangedEvent: any = '';

  correctFleet = true;

  @ViewChild('picture', { static: false }) picture: ElementRef;

  constructor(private storage: Storage, private afs: AngularFirestore, public loading: LoadingService, public router: Router,
    private camera: Camera, public actionCtrl: ActionSheetController, public alertCtrl: AlertController) { }

  ngOnInit() {
    this.fuel.key = UUID.UUID();
    this.fuel.date = moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD');
    this.fuel.time = moment(new Date().toISOString()).locale('en').format('HH:mm');
    this.storage.get('user').then(user => {
      this.fuel.driverKey = user.key;
      this.fuel.name = user.name;
      this.fuel.surname = user.surname;
      console.log(user.fleet)
      if (user.fleetNo !== undefined) {
        this.fuel.code = user.code;
        this.fuel.fleet = user.fleet;
        this.fuel.fleetNo = user.fleetNo;
      } else {
        this.fuel.fleetNo = '';
      }
    });
    this.afs.collection('stations').ref.orderBy('name').get().then(stations => {
      stations.forEach(station => {
        this.stations.push(station.data());
      });
    });
  }

  getTruck() {
    this.afs.collection('trucks').ref.orderBy('fleetNo').get().then(trucks => {
      trucks.forEach((truck: any) => {
        this.trucks.push({ registration: truck.data().registration, fleetNo: truck.data().fleetNo, fleet: truck.data().fleet });
      });
    });
  }

  changeTruck() {
    this.fuel.code = this.truck.registration;
    this.fuel.fleet = this.truck.fleet;
    this.fuel.fleetNo = this.truck.fleetNo;
    console.log(this.fuel.fleetNo);
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.fuel.receipt = event.base64;
  }

  async takePhoto() {
    let actionSheet = await this.actionCtrl.create({
      header: 'Photo Type',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Take photo',
          role: 'destructive',
          icon: 'camera-outline',
          handler: () => {
            this.captureImage(false);
          }
        },
        {
          text: 'Choose photo from Gallery',
          icon: 'images-outline',
          handler: () => {
            this.captureImage(true);
          }
        },
      ]
    });
    return await actionSheet.present();
  }

  async captureImage(useAlbum: boolean) {
    const options: CameraOptions = {
      quality: 90,
      targetWidth: 300,
      targetHeight: 300,
      allowEdit: true,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      correctOrientation: true,
      saveToPhotoAlbum: false,
      mediaType: this.camera.MediaType.PICTURE,
      ...useAlbum ? { sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM } : {}
    };
    return await this.camera.getPicture(options).then((imageData => {
      this.fuel.receipt = 'data:image/jpeg;base64,' + imageData;
    }));
  }

  setStation(station) {
    this.fuel.station = this.station.name
  }

  calcPrice() {
    console.log(this.station.price)
    this.fuel.price = this.fuel.litre * this.station.price;
    console.log(this.fuel.price)
  }

  save() {
    if (this.correctFleet === false) {
    }
    this.loading.present('Saving, Please Wait...').then(() => {
      this.afs.collection('fuel-records').doc(this.fuel.key).set(this.fuel);
      this.router.navigate(['home']);
      this.loading.dismiss();
    });
  }

  check() {
      if (this.fuel.km !== '') {
        if (this.fuel.litre !== 0) {
          if (this.fuel.price !== 0) {
            //if (this.fuel.receipt !== '') {
              this.save();
              /*
            } else {
              this.alertMsg('Receipt');
            }
            */
          } else {
            this.alertMsg('Price');
          }
        } else {
          this.alertMsg('Litres');
        }
      } else {
        this.alertMsg('Mileage');
      }
  }

  async alertMsg(item) {
    let prompt = await this.alertCtrl.create({
      header: 'Invalid Form',
      message: `This record is missing the following field: ${item}`,
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

}
