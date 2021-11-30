import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import moment from 'moment';
import { UUID } from 'angular2-uuid';
import { AngularFirestore } from '@angular/fire/firestore';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { LoadingService } from '../services/loading.service';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { ToastService } from '../services/toast.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-washbay-trailer',
  templateUrl: './washbay-trailer.page.html',
  styleUrls: ['./washbay-trailer.page.scss'],
})
export class WashbayTrailerPage implements OnInit {

  saved = false;
  code;
  type;
  checkType;

  trailerLrg = {
    type: 'washbay', report: 'Washbay Check', key: '', code: '', date: '', timeIn: '', timeOut: '', duration: {}, trailerReg: '', trailerFleet: '', trailerFleetNo: '', trailerKM: '', checkType: '', jobNo: '', controller: '', controllerSig: '', wash: false,
    polish: false, progress: 0, deviations: [], complete: true
  };

  optionA1;
  optionA2;
  optionB1;
  optionB2;
  optionC1;
  optionC2;

  isDrawing = true;

  signaturePadOptions: Object = {
    minWidth: 2,
    backgroundColor: '#fff',
    penColor: '#000',
    canvasWidth: 250
  };

  deviations = {
    note1: '', note2: '', note3: '',
    photo1: '', photo2: '', photo3: '',
  }

  showCrop = false;
  cropImageInput: any;
  cropImageOutput: any;

  allowdedFileExtentions = '';

  fileTypes: any = [];
  permittedFileTypes: any = [];
  photos = [];

  loadActive = false;

  imageChangedEvent: any = '';

  downloadURL: Observable<string | null>;

  @ViewChild('imageChooser1', { static: false }) filePickerRef1: ElementRef<HTMLInputElement>;
  @ViewChild('imageChooser2', { static: false }) filePickerRef2: ElementRef<HTMLInputElement>;
  @ViewChild('imageChooser3', { static: false }) filePickerRef3: ElementRef<HTMLInputElement>;

  @ViewChild('sigpad', { static: false }) sigPad: SignaturePad;

  constructor(public activatedRoute: ActivatedRoute, private storage: Storage, private afs: AngularFirestore, private afStorage: AngularFireStorage, public actionSheetController: ActionSheetController,
    public loading: LoadingService, public router: Router, public alertCtrl: AlertController, public camera: Camera, public toast: ToastService) { }

  ngOnInit() {
    this.code = this.activatedRoute.snapshot.paramMap.get('id1');
    this.type = this.activatedRoute.snapshot.paramMap.get('id2');
    this.checkType = this.activatedRoute.snapshot.paramMap.get('id3');
    console.log(this.code, this.checkType);
    this.afs.collection('trailers').doc(this.code).ref.get().then((trailer: any) => {
      this.storage.get('user').then(user => {
        this.trailerLrg.code = this.code;
        this.trailerLrg.checkType = this.checkType;
        this.trailerLrg.trailerReg = trailer.data().registration;
        this.trailerLrg.trailerFleet = trailer.data().fleet;
        this.trailerLrg.trailerFleetNo = trailer.data().fleetNo;
        this.trailerLrg.jobNo = trailer.data().jobNo
        this.trailerLrg.controller = user.name;
        this.trailerLrg.date = moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD');
        this.trailerLrg.timeIn = moment(new Date().toISOString()).locale('en').format('HH:mm');
        this.trailerLrg.key = UUID.UUID();
        this.afs.collection('inspections').doc(this.trailerLrg.key).set(this.trailerLrg);
      });
    });
  }

  drawStart() {
    this.isDrawing = true;
  }

  drawComplete() {
    this.isDrawing = false;
    this.trailerLrg.controllerSig = this.sigPad.toDataURL();
    this.update();
  }

  clearPad() {
    this.sigPad.clear();
    this.trailerLrg.controllerSig = '';
  }

  update() {
    this.trailerLrg.progress = 0;
    if (this.trailerLrg.jobNo !== '') {
      this.trailerLrg.progress = this.trailerLrg.progress + 1;
    }
    if (this.optionA1 === true || this.optionA2 === true) {
      this.trailerLrg.progress = this.trailerLrg.progress + 1;
      if (this.optionA2 === true) {
        var devs = {
          key: UUID.UUID(),
          date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
          time: moment(new Date().toISOString()).locale('en').format('HH:mm'),
          code: this.trailerLrg.trailerReg,
          fleet: this.trailerLrg.trailerFleet,
          fleetNo: this.trailerLrg.trailerFleetNo,
          status: 'Pending',
          inspection: this.trailerLrg.type
        };
        this.afs.collection('deviations').doc(devs.key).set(devs);
      }
    }
    if (this.optionB1 === true || this.optionB2 === true) {
      this.trailerLrg.progress = this.trailerLrg.progress + 1;
      if (this.optionB2 === true) {
        var devs = {
          key: UUID.UUID(),
          date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
          time: moment(new Date().toISOString()).locale('en').format('HH:mm'),
          code: this.trailerLrg.trailerReg,
          fleet: this.trailerLrg.trailerFleet,
          fleetNo: this.trailerLrg.trailerFleetNo,
          status: 'Pending',
          inspection: this.trailerLrg.type
        };
        this.afs.collection('deviations').doc(devs.key).set(devs);
      }
    }
    this.trailerLrg.progress = this.trailerLrg.progress / 3;
    this.afs.collection('inspections').doc(this.trailerLrg.key).update(this.trailerLrg);
    if (this.trailerLrg.progress === 0) {
      var status = 'In Queue';
    } else if (this.trailerLrg.progress > 0 && this.trailerLrg.progress < 1) {
      var status = 'In Progress';
    } else if (this.trailerLrg.progress === 1) {
      var status = 'Completed';
    }
    this.afs.collection('trailers').doc(this.trailerLrg.trailerReg).update({
      washbayStatus: status,
      washbayProgress: this.trailerLrg.progress,
      timeStamp: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD, HH:mm'),
      lastInspection: 'WashBay',
      lastInspectionTimestamp: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD, HH:mm'),
    });
  }

  check() {
    if (this.optionA2 === true && this.deviations.note1 === '') {
      return this.devMsg('Major Wash')
    }
    if (this.optionB2 === true && this.deviations.note2 === '') {
      return this.devMsg('Tyre Polish')
    }
    if (this.trailerLrg.jobNo !== '') {
      if (this.optionA1 === true || this.optionA2 === true) {
        if (this.optionB1 === true || this.optionB2 === true) {
          if (this.trailerLrg.controllerSig !== '') {
            return this.save()
          } else {
            this.alertMsg('Signature')
          }
        } else {
          this.alertMsg('Tyre Polish')
        }
      } else {
        this.alertMsg('Major Wash')
      }
    } else {
      this.alertMsg('Job Card Number')
    }
  }

  save() {
    this.saved = true;
    this.getDevLrg()
    this.loading.present('Saving, Please wait...').then(() => {
      // Calculate time to complete inspection
      this.trailerLrg.timeOut = moment(new Date().toISOString()).locale('en').format('HH:mm');
      this.trailerLrg.duration = moment(this.trailerLrg.timeOut, 'HH:mm').diff(moment(this.trailerLrg.timeIn, 'HH:mm'), 'minutes', true);

      // Save inspection
      this.update();
      this.router.navigate(['home']);
      this.loading.dismiss();
    });
  }

  getDevLrg() {
    this.trailerLrg.wash = this.optionA1;
    this.trailerLrg.polish = this.optionB1;
    if (this.deviations.note1 !== '') {
      this.trailerLrg.deviations.push({ item: 'Major Wash', note: this.deviations.note1, photo: this.deviations.photo1 })
    }
    if (this.deviations.note2 !== '') {
      this.trailerLrg.deviations.push({ item: 'Tyre Polish', note: this.deviations.note2, photo: this.deviations.photo2 })
    }
    if (this.deviations.note3 !== '') {
      this.trailerLrg.deviations.push({ item: '', note: this.deviations.note3, photo: this.deviations.photo3 })
    }
  }

  async alertMsg(item) {
    let prompt = await this.alertCtrl.create({
      header: 'Invalid Check',
      message: `This check is missing the following field: ${item}`,
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

  async devMsg(item) {
    let prompt = await this.alertCtrl.create({
      header: 'Invalid Deviation',
      message: `Please provide a note for why you selected 'No' for ${item}`,
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

      this.loading.present('Uploading...').then(() => {
        this.loadActive = true;

        var metadata = {
          contentType: 'image/jpeg',
        }
        var key = UUID.UUID();

        let photo = this.afStorage.ref(`deviation/washbay/${key}.jpeg`);

        photo.putString(imageData, 'base64', metadata).then(snapshot => {
          this.downloadURL = photo.getDownloadURL();
          this.downloadURL.subscribe(url => {
            if (url) {
              if (unit === 'photo1') {
                this.deviations.photo1 = url;
              } else if (unit === 'photo2') {
                this.deviations.photo2 = url;
              } else if (unit === 'photo3') {
                this.deviations.photo3 = url;
              }
              this.loading.dismiss().then(() => {
                this.loadActive = false;
                this.toast.show('Photo uploaded Successfully!')
              })
            }
          })
        })
      })
      setTimeout(async () => {
        if (this.loadActive === true) {
          this.loading.dismiss();
          const prompt = await this.alertCtrl.create({
            header: 'A Problem occured',
            message: `The internet connection is not strong enough to save this image. Please try again.`,
            cssClass: 'alert',
            buttons: [
              {
                text: 'OKAY',
                handler: data => {
                }
              },
            ],
          });
          return await prompt.present();
        }
      }, 15000);
    })
  }

  // File selector
  // To do: Error msg on incorrect file type
  onChooseFile(event: Event, unit) {
    console.log(unit)
    const file = (event.target as HTMLInputElement).files[0];

    const reader = new FileReader();

    reader.onload = () => {

      this.loading.present('Uploading...').then(() => {
        this.loadActive = true;

        var key = UUID.UUID();

        const filePath = `deviation/washbay/${key}`;
        const fileRef = this.afStorage.ref(filePath);
        const task = this.afStorage.upload(filePath, file);

        // get notified when the download URL is available
        task.snapshotChanges().pipe(
          finalize(() => {
            this.downloadURL = fileRef.getDownloadURL();
            this.downloadURL.subscribe(url => {
              if (url) {
                if (unit === 'photo1') {
                  this.deviations.photo1 = url;
                } else if (unit === 'photo2') {
                  this.deviations.photo2 = url;
                } else if (unit === 'photo3') {
                  this.deviations.photo3 = url;
                }
                this.loading.dismiss().then(() => {
                  this.loadActive = false;
                  this.toast.show('Photo Uploaded Successfully!')
                })
              }
            })
          })
        ).subscribe()
      })
      setTimeout(async () => {
        if (this.loadActive === true) {
          this.loading.dismiss();
          const prompt = await this.alertCtrl.create({
            header: 'A Problem occured',
            message: `The internet connection is not strong enough to save this image. Please try again.`,
            cssClass: 'alert',
            buttons: [
              {
                text: 'OKAY',
                handler: data => {
                }
              },
            ],
          });
          return await prompt.present();
        }
      }, 15000);
    };
    reader.readAsDataURL(file);
  }

  removeImage(unit) {
    if (unit === 'photo1') {
      this.deviations.photo1 = '';
    } else if (unit === 'photo2') {
      this.deviations.photo2 = '';
    } else if (unit === 'photo3') {
      this.deviations.photo3 = '';
    }
  }

  ngOnDestroy() {
    if (this.saved === true) {
    } else {
      this.afs.collection('inspections').doc(this.trailerLrg.key).delete();
      this.afs.collection('trailers').doc(this.trailerLrg.code).update({ washbayStatus: 'Skipped', washbayProgress: 0 });
    }
  }

  changeA1() {
    if (this.optionA1 === false) {
      this.optionA2 = true;
    } else {
      this.optionA2 = false;
    }
    this.update();
  }
  changeA2() {
    if (this.optionA2 === false) {
      this.optionA1 = true;
    } else {
      this.optionA1 = false;
    }
    this.update();
  }

  changeB1() {
    if (this.optionB1 === false) {
      this.optionB2 = true;
    } else {
      this.optionB2 = false;
    }
    this.update();
  }
  changeB2() {
    if (this.optionB2 === false) {
      this.optionB1 = true;
    } else {
      this.optionB1 = false;
    }
    this.update();
  }
  changeC1() {
    if (this.optionC1 === false) {
      this.optionC2 = true;
    } else {
      this.optionC2 = false;
    }
    this.update();
  }
  changeC2() {
    if (this.optionC2 === false) {
      this.optionC1 = true;
    } else {
      this.optionC1 = false;
    }
    this.update();
  }

}
/*

 trailerMid = {
    type: 'washbay', key: '', code: '', date: '', timeIn: '', timeOut: '', duration: {}, trailerReg: '', trailerKM: '', checkType: '', jobNo: '', controller: '', controllerSig: '',
    wash: false, progress: 0, deviations: [],
  };

  trailerLrg = {
    type: 'washbay', key: '', code: '', date: '', timeIn: '', timeOut: '', duration: {}, trailerReg: '', trailerKM: '', checkType: '', jobNo: '', controller: '', controllerSig: '', wash: false,
    polish: false, progress: 0, deviations: [],
  };

  optionA1;
  optionA2;
  optionB1;
  optionB2;
  optionC1;
  optionC2;

  isDrawing = true;

  signaturePadOptions: Object = {
    minWidth: 2,
    backgroundColor: '#fff',
    penColor: '#000',
    canvasWidth: 250
  };

  deviations = {
    note1: '', note2: '', note3: '',
    photo1: '', photo2: '', photo3: '',
  }

  showCrop = false;
  cropImageInput: any;
  cropImageOutput: any;

  allowdedFileExtentions = '';

  fileTypes: any = [];
  permittedFileTypes: any = [];
  photos = [];

  imageChangedEvent: any = '';

  downloadURL: Observable<string | null>;

  @ViewChild('imageChooser1', { static: false }) filePickerRef1: ElementRef<HTMLInputElement>;
  @ViewChild('imageChooser2', { static: false }) filePickerRef2: ElementRef<HTMLInputElement>;
  @ViewChild('imageChooser3', { static: false }) filePickerRef3: ElementRef<HTMLInputElement>;

  @ViewChild('sigpad', { static: false }) sigPad: SignaturePad;

  constructor(public activatedRoute: ActivatedRoute, private storage: Storage, private afs: AngularFirestore, private afStorage: AngularFireStorage, public actionSheetController: ActionSheetController,
    public loading: LoadingService, public router: Router, public alertCtrl: AlertController, public camera: Camera, public toast: ToastService) { }

  ngOnInit() {
    this.code = this.activatedRoute.snapshot.paramMap.get('id1');
    this.type = this.activatedRoute.snapshot.paramMap.get('id2');
    this.checkType = this.activatedRoute.snapshot.paramMap.get('id3');
    console.log(this.code, this.checkType);
    this.afs.collection('trailers').doc(this.code).ref.get().then(trailer => {
      this.storage.get('user').then(user => {
        if (this.checkType === 'Medium') {
          this.trailerMid.code = this.code;
          this.trailerMid.checkType = this.checkType;
          this.trailerMid.trailerReg = trailer.data().registration;
          this.trailerMid.jobNo = trailer.data().jobNo
          this.trailerMid.controller = user.name;
          this.trailerMid.date = moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD');
          this.trailerMid.timeIn = moment(new Date().toISOString()).locale('en').format('HH:mm');
          this.trailerMid.key = UUID.UUID();
          this.afs.collection('inspections').doc(this.trailerMid.key).set(this.trailerMid);
        } else {
          this.trailerLrg.code = this.code;
          this.trailerLrg.checkType = this.checkType;
          this.trailerLrg.trailerReg = trailer.data().registration;
          this.trailerLrg.jobNo = trailer.data().jobNo
          this.trailerLrg.controller = user.name;
          this.trailerLrg.date = moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD');
          this.trailerLrg.timeIn = moment(new Date().toISOString()).locale('en').format('HH:mm');
          this.trailerLrg.key = UUID.UUID();
          this.afs.collection('inspections').doc(this.trailerLrg.key).set(this.trailerLrg);
        }
      });
    });
  }

  drawStart() {
    this.isDrawing = true;
  }

  drawComplete() {
    this.isDrawing = false;
    if (this.checkType === 'Medium') {
      this.trailerMid.controllerSig = this.sigPad.toDataURL();
      this.update();
    } else {
      this.trailerLrg.controllerSig = this.sigPad.toDataURL();
      this.update();
    }
  }

  clearPad() {
    this.sigPad.clear();
    if (this.checkType === 'Medium') {
      this.trailerMid.controllerSig = '';
    } else {
      this.trailerLrg.controllerSig = '';
    }
  }

  update() {
    if (this.checkType === 'Medium') {
      this.trailerMid.progress = 0;
      if (this.trailerMid.jobNo !== '') {
        this.trailerMid.progress = this.trailerMid.progress + 1;
      }
      if (this.optionA1 === true || this.optionA2 === true) {
        this.trailerMid.progress = this.trailerMid.progress + 1;
      }
      this.trailerMid.progress = this.trailerMid.progress / 2;
      this.afs.collection('inspections').doc(this.trailerMid.key).update(this.trailerMid);
      if (this.trailerMid.progress === 0) {
        var status = 'In Queue';
      } else if (this.trailerMid.progress > 0 && this.trailerMid.progress < 1) {
        var status = 'In Progress';
      } else if (this.trailerMid.progress === 1) {
        var status = 'Completed';
      }
      this.afs.collection('trailers').doc(this.trailerMid.trailerReg).update({
        washbayStatus: status,
        washbayProgress: this.trailerMid.progress,
        timeStamp: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD, HH:mm'),
      });
    } else {
      this.trailerLrg.progress = 0;
      if (this.trailerLrg.jobNo !== '') {
        this.trailerLrg.progress = this.trailerLrg.progress + 1;
      }
      if (this.optionA1 === true || this.optionA2 === true) {
        this.trailerLrg.progress = this.trailerLrg.progress + 1;
      }
      if (this.optionB1 === true || this.optionB2 === true) {
        this.trailerLrg.progress = this.trailerLrg.progress + 1;
      }
      this.trailerLrg.progress = this.trailerLrg.progress / 3;
      this.afs.collection('inspections').doc(this.trailerLrg.key).update(this.trailerLrg);
      if (this.trailerLrg.progress === 0) {
        var status = 'In Queue';
      } else if (this.trailerLrg.progress > 0 && this.trailerLrg.progress < 1) {
        var status = 'In Progress';
      } else if (this.trailerLrg.progress === 1) {
        var status = 'Completed';
      }
      this.afs.collection('trailers').doc(this.trailerLrg.trailerReg).update({
        washbayStatus: status,
        washbayProgress: this.trailerLrg.progress,
        timeStamp: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD, HH:mm'),
      });
    }
  }

  check() {
    if (this.checkType === 'Medium') {
      if (this.trailerMid.jobNo !== '') {
        if (this.optionA1 === true || this.optionA2 === true) {
          this.save()
        } else {
          this.alertMsg('Wash')
        }
      } else {
        this.alertMsg('Job Card Number')
      }
    } else if (this.checkType === 'Large') {
      if (this.trailerLrg.jobNo !== '') {
        if (this.optionA1 === true || this.optionA2 === true) {
          if (this.optionB1 === true || this.optionB2 === true) {
            this.save()
          } else {
            this.alertMsg('Tyre Polish')
          }
        } else {
          this.alertMsg('Major Wash')
        }
      } else {
        this.alertMsg('Job Card Number')
      }
    }
  }

  save() {
    this.saved = true;
    if (this.checkType === 'Medium') {
      this.getDevMid()
      this.loading.present('Saving, Please wait...').then(() => {
        // Calculate time to complete inspection
        this.trailerMid.timeOut = moment(new Date().toISOString()).locale('en').format('HH:mm');
        this.trailerMid.duration = moment(this.trailerMid.timeOut, 'HH:mm').diff(moment(this.trailerMid.timeIn, 'HH:mm'), 'minutes', true);

        // Save inspection
        this.update();
        this.router.navigate(['home']);
        this.loading.dismiss();
      });
    } else {
      this.getDevLrg()
      this.loading.present('Saving, Please wait...').then(() => {
        // Calculate time to complete inspection
        this.trailerLrg.timeOut = moment(new Date().toISOString()).locale('en').format('HH:mm');
        this.trailerLrg.duration = moment(this.trailerLrg.timeOut, 'HH:mm').diff(moment(this.trailerLrg.timeIn, 'HH:mm'), 'minutes', true);

        // Save inspection
        this.update();
        this.router.navigate(['home']);
        this.loading.dismiss();
      });
    }
  }

  getDevMid() {
    this.trailerMid.wash = this.optionA1;
    if (this.deviations.note1 !== '') {
      this.trailerMid.deviations.push({ note: this.deviations.note1, photo: this.deviations.photo1 })
    }
    if (this.deviations.note2 !== '') {
      this.trailerMid.deviations.push({ note: this.deviations.note2, photo: this.deviations.photo2 })
    }
    if (this.deviations.note3 !== '') {
      this.trailerMid.deviations.push({ note: this.deviations.note3, photo: this.deviations.photo3 })
    }
  }

  getDevLrg() {
    this.trailerLrg.wash = this.optionA1;
    this.trailerLrg.polish = this.optionB1;
    if (this.deviations.note1 !== '') {
      this.trailerLrg.deviations.push({ note: this.deviations.note1, photo: this.deviations.photo1 })
    }
    if (this.deviations.note2 !== '') {
      this.trailerLrg.deviations.push({ note: this.deviations.note2, photo: this.deviations.photo2 })
    }
    if (this.deviations.note3 !== '') {
      this.trailerLrg.deviations.push({ note: this.deviations.note3, photo: this.deviations.photo3 })
    }
  }

  async alertMsg(item) {
    let prompt = await this.alertCtrl.create({
      header: 'Invalid Check',
      message: `This check is missing the following field: ${item}`,
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

      let photo = this.afStorage.ref(`deviation: ${key}.jpeg`);

      photo.putString(imageData, 'base64', metadata).then(snapshot => {
        const ref = this.afStorage.ref(`deviation: ${key}.jpeg`);
        this.downloadURL = ref.getDownloadURL();
        this.downloadURL.subscribe(url => {
          if (url) {
            if (unit === 'photo1') {
              this.deviations.photo1 = url;
            } else if (unit === 'photo2') {
              this.deviations.photo2 = url;
            } else if (unit === 'photo3') {
              this.deviations.photo3 = url;
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
  onChooseFile(event: Event, unit) {
    console.log(unit)
    const file = (event.target as HTMLInputElement).files[0];

    const reader = new FileReader();

    reader.onload = () => {

      this.loading.present('Uploading...');

      var key = UUID.UUID();

      const filePath = `deviation: ${key}`;
      const fileRef = this.afStorage.ref(filePath);
      const task = this.afStorage.upload(filePath, file);

      // get notified when the download URL is available
      task.snapshotChanges().pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe(url => {
            if (url) {
              if (unit === 'photo1') {
                this.deviations.photo1 = url;
              } else if (unit === 'photo2') {
                this.deviations.photo2 = url;
              } else if (unit === 'photo3') {
                this.deviations.photo3 = url;
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

  removeImage(unit) {
    if (unit === 'photo1') {
      this.deviations.photo1 = '';
    } else if (unit === 'photo2') {
      this.deviations.photo2 = '';
    } else if (unit === 'photo3') {
      this.deviations.photo3 = '';
    }
  }

  ngOnDestroy() {
    if (this.saved === true) {
    } else {
      if (this.checkType === 'Medium') {
        this.afs.collection('inspections').doc(this.trailerMid.key).delete();
      } else if (this.checkType === 'Large') {
        this.afs.collection('inspections').doc(this.trailerLrg.key).delete();
      }
    }
  }

  changeA1() {
    if (this.optionA1 === false) {
      this.optionA2 = true;
    } else {
      this.optionA2 = false;
    }
    this.update();
  }
  changeA2() {
    if (this.optionA2 === false) {
      this.optionA1 = true;
    } else {
      this.optionA1 = false;
    }
    this.update();
  }

  changeB1() {
    if (this.optionB1 === false) {
      this.optionB2 = true;
    } else {
      this.optionB2 = false;
    }
    this.update();
  }
  changeB2() {
    if (this.optionB2 === false) {
      this.optionB1 = true;
    } else {
      this.optionB1 = false;
    }
    this.update();
  }
  changeC1() {
    if (this.optionC1 === false) {
      this.optionC2 = true;
    } else {
      this.optionC2 = false;
    }
    this.update();
  }
  changeC2() {
    if (this.optionC2 === false) {
      this.optionC1 = true;
    } else {
      this.optionC1 = false;
    }
    this.update();
  }

}

*/


