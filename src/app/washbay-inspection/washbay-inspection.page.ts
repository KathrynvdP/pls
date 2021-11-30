import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { dismantleLicDisk } from '../utils/utility';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import moment from 'moment';
import { UUID } from 'angular2-uuid';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { LoadingService } from '../services/loading.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { ToastService } from '../services/toast.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-washbay-inspection',
  templateUrl: './washbay-inspection.page.html',
  styleUrls: ['./washbay-inspection.page.scss'],
})
export class WashbayInspectionPage implements OnInit {

  code;
  type;

  truckCheck = false;
  trailerCheck = false;

  optionA1;
  optionA2;

  wash = {
    type: 'washbay', report: 'Washbay', key: '', code: '', date: '', timeIn: '', jobNo: '', controller: '',
  };

  downloadURL: Observable<string | null>;
  photo = '';

  trailers = [];
  trailer;

  @ViewChild('imageChooser', { static: false }) filePickerRef: ElementRef<HTMLInputElement>;

  constructor(private afs: AngularFirestore, private barcodeScanner: BarcodeScanner, public router: Router, private afStorage: AngularFireStorage, private camera: Camera, public loading: LoadingService, public toast: ToastService, public actionSheetController: ActionSheetController, private storage: Storage, public alertCtrl: AlertController) { }

  ngOnInit() {
    this.afs.collection('trailers').ref.orderBy('fleetNo').get().then(trailers => {
      trailers.forEach(trailer => {
          this.trailers.push(trailer.data());
      })
    })
  }

  scan() {
    this.barcodeScanner.scan({
      showTorchButton: true,
      showFlipCameraButton: true,
      formats: 'QR_CODE,PDF_417'
    }).then(barcodeData => {
      console.log(barcodeData);
      console.log(dismantleLicDisk(barcodeData).RegNum);

      // Getting barcode
      this.code = dismantleLicDisk(barcodeData).RegNum;
      // Using this code to determine the unit type (truck/trailer/driver)
      this.afs.collection('codes').doc(this.code).ref.get().then(async (data: any) => {
        if (data.data()) {
          this.type = data.data().type;
          console.log(this.type);
          // Uses this type to search the correct collection. Gets info on unit
          this.afs.collection(this.type).doc(this.code).ref.get().then(async (info: any) => {
            if (info.data()) {
              if (info.data().jobNo !== '') {
                await this.checkInspecs(info.data())
                this.wash.jobNo = info.data().jobNo;
                if (this.type === 'trucks') {
                  this.truckCheck = true;
                } else if (this.type === 'trailers') {
                  this.trailerCheck = true;
                }
              } else {
                this.checkinAlert();
              }
            } else {
              const prompt = await this.alertCtrl.create({
                header: 'A Problem occured',
                message: `There was a problem when getting this vehicles details. Please check your internet connections and try again.`,
                cssClass: 'alert',
                buttons: [
                  {
                    text: 'OKAY',
                    handler: data => {
                      this.router.navigate(['home'])
                    }
                  },
                ],
                backdropDismiss: false,
              });
              return await prompt.present();
            }
          });
        } else {
          const prompt = await this.alertCtrl.create({
            header: 'This Truck/Trailer does not exist',
            message: `This vehicle has not been checked in at security. Please send the driver back to the Security Check In.`,
            cssClass: 'alert',
            buttons: [
              {
                text: 'OKAY',
                handler: data => {
                  this.router.navigate(['home'])
                }
              },
            ],
            backdropDismiss: false,
          });
          return await prompt.present();
        }
      });
    }).catch(err => {
      alert('Error' + err);
    });
  }

  async updateTrailer(trailer) {
    console.log(trailer.code)
    if (trailer.jobNo !== '' && trailer.jobNo !== undefined) {
      await this.checkInspecs(trailer)
      this.type = 'trailers';
      this.code = trailer.code;
      this.wash.jobNo = trailer.jobNo;
      this.trailerCheck = true;
    } else {
      this.checkinAlert();
    }
  }

  async checkinAlert() {
    const prompt = await this.alertCtrl.create({
      header: 'This truck/trailer has not checked in.',
      message: `This vehicle has not completed the Security Check In. Please tell the driver to return to security.`,
      cssClass: 'alert',
      buttons: [
        {
          text: 'OKAY',
          handler: data => {
            this.router.navigate(['home'])
          }
        },
      ],
      backdropDismiss: false,
    });
    return await prompt.present();
  }

  async checkInspecs(trailer) {
    this.afs.collection('inspections').ref.where('jobNo', '==', trailer.jobNo).where('code', '==', trailer.code).where('type', '==', 'washbay').limit(1).get().then(query => {
      if (query.size > 0) {
        console.log('Found other check with jobNo')
        this.alert()
      } else {
        return
      }
    })
  }

  async alert() {
    let prompt = await this.alertCtrl.create({
      header: 'Invalid Request!',
      message: `This check has already been completed for this vehicle/job card. Please contact an Operator if this is incorrect.`,
      cssClass: 'alert',
      backdropDismiss: false,
      buttons: [
        {
          text: 'OK',
          handler: data => {
            this.router.navigate(['home'])
          }
        },
      ]
    });
    return await prompt.present();
  }

  // Route depending on type (truck/trailer)
  truckRoute() {
    this.router.navigate([`washbay-truck`, { id1: this.code, id2: this.type }]);
  }

  trailerRoute() {
    this.router.navigate([`washbay-trailer`, { id1: this.code, id2: this.type }]);
  }

  changeA1() {
    if (this.optionA1 === false) {
      this.optionA2 = true;
    } else {
      this.optionA2 = false;
    }
  }
  changeA2() {
    if (this.optionA2 === false) {
      this.optionA1 = true;
    } else {
      this.optionA1 = false;
    }
  }


  /////////    Deviation Photos      /////////

  async presentActionSheet(photo, file) {
    const actionSheet = await this.actionSheetController.create({
      mode: 'ios',
      header: 'Image Source',
      buttons: [{
        text: 'Camera',
        icon: 'camera',
        handler: () => {
          this.takePicture(photo);
        }
      },
      {
        text: 'Attachments',
        icon: 'attach-outline',
        handler: () => {
          file.nativeElement.click();
        }
      }]
    });
    await actionSheet.present();
  }

  // Open Camera Option
  // Return Image as Base64 String

  async takePicture(unit) {
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

      var key = UUID.UUID();

      let photo = this.afStorage.ref(`washbay/vehicle_photos/${key}.jpeg`);

      photo.putString(imageData, 'base64', metadata).then(snapshot => {
        this.downloadURL = photo.getDownloadURL();
        this.downloadURL.subscribe(url => {
          if (url) {
            this.photo = url;
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
  onChooseFile(event: Event, unit) {
    console.log(unit)
    const file = (event.target as HTMLInputElement).files[0];

    const reader = new FileReader();

    reader.onload = () => {

      this.loading.present('Uploading...');

      var key = UUID.UUID();

      const filePath = `washbay/vehicle_photos/${key}`;
      const fileRef = this.afStorage.ref(filePath);
      const task = this.afStorage.upload(filePath, file);

      // get notified when the download URL is available
      task.snapshotChanges().pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe(url => {
            if (url) {
              this.photo = url;
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

  removeImage() {
    this.photo = '';
  }

  save() {
    if (this.optionA1 === true) {   // Needs wash
      if (this.truckCheck === true) {
        this.truckRoute();
      } else if (this.trailerCheck === true) {
        this.trailerRoute();
      }
    } else {    //  Saves an inspection of incomplete wash
      this.form();
    }
  }

  form() {
    if (this.photo !== '') {
      this.loading.present('Submitting, Please Wait...').then(() => {
        this.storage.get('user').then(user => {
          var wash = {
            type: 'washbay', key: UUID.UUID(), code: this.code, date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
            timeIn: moment(new Date().toISOString()).locale('en').format('HH:mm'), jobNo: this.wash.jobNo, controller: user.name, complete: false, photo: this.photo
          }
          this.afs.collection('inspections').doc(wash.key).set(wash)
          this.afs.collection(this.type).doc(this.code).update({ washbayStatus: 'Not Required', washbayProgress: 0 })
        })
        this.router.navigate(['home']);
        this.loading.dismiss();
      })
    } else {
      this.alertMsg();
    }
  }

  async alertMsg() {
    let prompt = await this.alertCtrl.create({
      header: 'Invalid Submission',
      message: `Please take a photo before submitting`,
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
