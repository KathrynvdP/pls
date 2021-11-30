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
  selector: 'app-washbay-truck',
  templateUrl: './washbay-truck.page.html',
  styleUrls: ['./washbay-truck.page.scss'],
})
export class WashbayTruckPage implements OnInit {

  saved = false;
  code;
  type;
  checkType;

  truckLrg = {
    type: 'washbay', report: 'Washbay Check', key: '', code: '', date: '', timeIn: '', timeOut: '', duration: {}, truckReg: '', truckFleet: '', truckFleetNo: '', checkType: '', jobNo: '',
    controller: '', controllerSig: '', wash: false, progress: 0, deviations: [],
    chassie: false, sanitize: false, polish: false, complete: true,
  };

  optionA1;
  optionA2;
  optionB1;
  optionB2;
  optionC1;
  optionC2;
  optionD1;
  optionD2;

  isDrawing = true;

  signaturePadOptions: Object = {
    minWidth: 2,
    backgroundColor: '#fff',
    penColor: '#000',
    canvasWidth: 250
  };

  @ViewChild('sigpad', { static: false }) sigPad: SignaturePad;

  deviations = {
    note1: '', note2: '', note3: '', note4: '',
    photo1: '', photo2: '', photo3: '', photo4: '',
  }

  showCrop = false;
  cropImageInput: any;
  cropImageOutput: any;

  allowdedFileExtentions = '';

  fileTypes: any = [];
  permittedFileTypes: any = [];
  photos = [];

  imageChangedEvent: any = '';

  loadActive = false;

  downloadURL: Observable<string | null>;

  @ViewChild('imageChooser1', { static: false }) filePickerRef1: ElementRef<HTMLInputElement>;
  @ViewChild('imageChooser2', { static: false }) filePickerRef2: ElementRef<HTMLInputElement>;
  @ViewChild('imageChooser3', { static: false }) filePickerRef3: ElementRef<HTMLInputElement>;
  @ViewChild('imageChooser4', { static: false }) filePickerRef4: ElementRef<HTMLInputElement>;

  constructor(public activatedRoute: ActivatedRoute, private storage: Storage, private afs: AngularFirestore, private afStorage: AngularFireStorage, public actionSheetController: ActionSheetController,
    public loading: LoadingService, public router: Router, public alertCtrl: AlertController, public camera: Camera, public toast: ToastService) { }

  ngOnInit() {
    this.code = this.activatedRoute.snapshot.paramMap.get('id1');
    this.type = this.activatedRoute.snapshot.paramMap.get('id2');
    this.checkType = this.activatedRoute.snapshot.paramMap.get('id3');
    this.afs.collection('trucks').doc(this.code).ref.get().then((truck: any) => {
      this.storage.get('user').then(user => {
        this.truckLrg.code = this.code;
        this.truckLrg.checkType = this.checkType;
        this.truckLrg.truckReg = truck.data().registration;
        this.truckLrg.truckFleet = truck.data().fleet;
        this.truckLrg.truckFleetNo = truck.data().fleetNo;
        this.truckLrg.jobNo = truck.data().jobNo
        this.truckLrg.controller = user.name;
        this.truckLrg.date = moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD');
        this.truckLrg.timeIn = moment(new Date().toISOString()).locale('en').format('HH:mm');
        this.truckLrg.key = UUID.UUID();
        this.afs.collection('inspections').doc(this.truckLrg.key).set(this.truckLrg);
      });
    });
  }

  drawStart() {
    this.isDrawing = true;
  }

  drawComplete() {
    this.isDrawing = false;
    this.truckLrg.controllerSig = this.sigPad.toDataURL();
  }

  clearPad() {
    this.sigPad.clear();
    this.truckLrg.controllerSig = '';
  }

  update() {
    this.truckLrg.progress = 0;
    if (this.truckLrg.jobNo !== '') {
      this.truckLrg.progress = this.truckLrg.progress + 1;
    }
    if (this.optionA1 === true || this.optionA2 === true) {
      this.truckLrg.progress = this.truckLrg.progress + 1;
      if (this.optionA2 === true) {
        var devs = {
          key: UUID.UUID(),
          date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
          time: moment(new Date().toISOString()).locale('en').format('HH:mm'),
          code: this.truckLrg.truckReg,
          fleet: this.truckLrg.truckFleet,
          fleetNo: this.truckLrg.truckFleetNo,
          status: 'Pending',
          inspection: this.truckLrg.type
        };
        this.afs.collection('deviations').doc(devs.key).set(devs);
      }
    }
    if (this.optionB1 === true || this.optionB2 === true) {
      this.truckLrg.progress = this.truckLrg.progress + 1;
      if (this.optionB2 === true) {
        var devs = {
          key: UUID.UUID(),
          date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
          time: moment(new Date().toISOString()).locale('en').format('HH:mm'),
          code: this.truckLrg.truckReg,
          fleet: this.truckLrg.truckFleet,
          fleetNo: this.truckLrg.truckFleetNo,
          status: 'Pending',
          inspection: this.truckLrg.type
        };
        this.afs.collection('deviations').doc(devs.key).set(devs);
      }
    }
    if (this.optionC1 === true || this.optionC2 === true) {
      this.truckLrg.progress = this.truckLrg.progress + 1;
      if (this.optionC2 === true) {
        var devs = {
          key: UUID.UUID(),
          date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
          time: moment(new Date().toISOString()).locale('en').format('HH:mm'),
          code: this.truckLrg.truckReg,
          fleet: this.truckLrg.truckFleet,
          fleetNo: this.truckLrg.truckFleetNo,
          status: 'Pending',
          inspection: this.truckLrg.type
        };
        this.afs.collection('deviations').doc(devs.key).set(devs);
      }
    }
    if (this.optionD1 === true || this.optionD2 === true) {
      this.truckLrg.progress = this.truckLrg.progress + 1;
      if (this.optionD2 === true) {
        var devs = {
          key: UUID.UUID(),
          date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
          time: moment(new Date().toISOString()).locale('en').format('HH:mm'),
          code: this.truckLrg.truckReg,
          fleet: this.truckLrg.truckFleet,
          fleetNo: this.truckLrg.truckFleetNo,
          status: 'Pending',
          inspection: this.truckLrg.type
        };
        this.afs.collection('deviations').doc(devs.key).set(devs);
      }
    }
    this.truckLrg.progress = this.truckLrg.progress / 5;
    console.log(this.truckLrg.progress)
    this.afs.collection('inspections').doc(this.truckLrg.key).update(this.truckLrg);
    if (this.truckLrg.progress === 0) {
      var status = 'In Queue';
    } else if (this.truckLrg.progress > 0 && this.truckLrg.progress < 1) {
      var status = 'In Progress';
    } else if (this.truckLrg.progress === 1) {
      var status = 'Completed';
    }
    this.afs.collection('trucks').doc(this.truckLrg.truckReg).update({
      washbayStatus: status,
      washbayProgress: this.truckLrg.progress,
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
      return this.devMsg('Degrease Chassie')
    }
    if (this.optionC2 === true && this.deviations.note3 === '') {
      return this.devMsg('Cab Sanitized')
    }
    if (this.optionD2 === true && this.deviations.note4 === '') {
      return this.devMsg('Tyre Polish')
    }
    if (this.truckLrg.jobNo !== '') {
      if (this.optionA1 === true || this.optionA2 === true) {
        if (this.optionB1 === true || this.optionB2 === true) {
          if (this.optionC1 === true || this.optionC2 === true) {
            if (this.optionD1 === true || this.optionD2 === true) {
              if (this.truckLrg.controllerSig !== '') {
                return this.save()
              } else {
                this.alertMsg('Signature')
              }
            } else {
              this.alertMsg('Tyre Polish')
            }
          } else {
            this.alertMsg('Cab Sanitized')
          }
        } else {
          this.alertMsg('Degrease Chassie')
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
      this.truckLrg.timeOut = moment(new Date().toISOString()).locale('en').format('HH:mm');
      this.truckLrg.duration = moment(this.truckLrg.timeOut, 'HH:mm').diff(moment(this.truckLrg.timeIn, 'HH:mm'), 'minutes', true);

      // Save inspection
      this.update();
      this.router.navigate(['home']);
      this.loading.dismiss();
    });
  }

  getDevLrg() {
    this.truckLrg.wash = this.optionA1;
    this.truckLrg.chassie = this.optionB1;
    this.truckLrg.sanitize = this.optionC1;
    this.truckLrg.polish = this.optionD1;
    if (this.deviations.note1 !== '') {
      this.truckLrg.deviations.push({ item: 'Major Wash', note: this.deviations.note1, photo: this.deviations.photo1 })
    }
    if (this.deviations.note2 !== '') {
      this.truckLrg.deviations.push({ item: 'Degrease Chassie', note: this.deviations.note2, photo: this.deviations.photo2 })
    }
    if (this.deviations.note3 !== '') {
      this.truckLrg.deviations.push({ item: 'Cab Sanitized', note: this.deviations.note3, photo: this.deviations.photo3 })
    }
    if (this.deviations.note4 !== '') {
      this.truckLrg.deviations.push({ item: 'Tyre Polish', note: this.deviations.note4, photo: this.deviations.photo4 })
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
              } else if (unit === 'photo4') {
                this.deviations.photo4 = url;
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
                } else if (unit === 'photo4') {
                  this.deviations.photo4 = url;
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
    } else if (unit === 'photo4') {
      this.deviations.photo4 = '';
    }
  }

  ngOnDestroy() {
    if (this.saved === true) {
    } else {
      this.afs.collection('inspections').doc(this.truckLrg.key).delete();
      this.afs.collection('trucks').doc(this.truckLrg.code).update({ washbayStatus: 'Skipped', washbayProgress: 0 });
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
  changeD1() {
    if (this.optionD1 === false) {
      this.optionD2 = true;
    } else {
      this.optionD2 = false;
    }
    this.update();
  }
  changeD2() {
    if (this.optionD2 === false) {
      this.optionD1 = true;
    } else {
      this.optionD1 = false;
    }
    this.update();
  }

}

/*

 truckMid = {
    type: 'washbay', key: '', code: '', date: '', timeIn: '', timeOut: '', duration: {}, truckReg: '', checkType: '', jobNo: '',
    controller: '', controllerSig: '', wash: false, progress: 0, deviations: [],
  };

  truckLrg = {
    type: 'washbay', key: '', code: '', date: '', timeIn: '', timeOut: '', duration: {}, truckReg: '', checkType: '', jobNo: '',
    controller: '', controllerSig: '', wash: false, progress: 0, deviations: [],
    chassie: false, sanitize: false, polish: false,
  };

  optionA1;
  optionA2;
  optionB1;
  optionB2;
  optionC1;
  optionC2;
  optionD1;
  optionD2;

  isDrawing = true;

  signaturePadOptions: Object = {
    minWidth: 2,
    backgroundColor: '#fff',
    penColor: '#000',
    canvasWidth: 250
  };

  @ViewChild('sigpad', { static: false }) sigPad: SignaturePad;

  deviations = {
    note1: '', note2: '', note3: '', note4: '',
    photo1: '', photo2: '', photo3: '', photo4: '',
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
  @ViewChild('imageChooser4', { static: false }) filePickerRef4: ElementRef<HTMLInputElement>;

  constructor(public activatedRoute: ActivatedRoute, private storage: Storage, private afs: AngularFirestore, private afStorage: AngularFireStorage, public actionSheetController: ActionSheetController,
    public loading: LoadingService, public router: Router, public alertCtrl: AlertController, public camera: Camera, public toast: ToastService) { }

  ngOnInit() {
    this.code = this.activatedRoute.snapshot.paramMap.get('id1');
    this.type = this.activatedRoute.snapshot.paramMap.get('id2');
    this.checkType = this.activatedRoute.snapshot.paramMap.get('id3');
    this.afs.collection('trucks').doc(this.code).ref.get().then(truck => {
      this.storage.get('user').then(user => {
        if (this.checkType === 'Medium') {
          this.truckMid.code = this.code;
          this.truckMid.checkType = this.checkType;
          this.truckMid.truckReg = truck.data().registration;
          this.truckMid.jobNo = truck.data().jobNo
          this.truckMid.controller = user.name;
          this.truckMid.date = moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD');
          this.truckMid.timeIn = moment(new Date().toISOString()).locale('en').format('HH:mm');
          this.truckMid.key = UUID.UUID();
          this.afs.collection('inspections').doc(this.truckMid.key).set(this.truckMid);
        } else {
          this.truckLrg.code = this.code;
          this.truckLrg.checkType = this.checkType;
          this.truckLrg.truckReg = truck.data().registration;
          this.truckLrg.jobNo = truck.data().jobNo
          this.truckLrg.controller = user.name;
          this.truckLrg.date = moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD');
          this.truckLrg.timeIn = moment(new Date().toISOString()).locale('en').format('HH:mm');
          this.truckLrg.key = UUID.UUID();
          this.afs.collection('inspections').doc(this.truckLrg.key).set(this.truckLrg);
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
      this.truckMid.controllerSig = this.sigPad.toDataURL();
    } else {
      this.truckLrg.controllerSig = this.sigPad.toDataURL();
    }
  }

  clearPad() {
    this.sigPad.clear();
    if (this.checkType === 'Medium') {
      this.truckMid.controllerSig = '';
    } else {
      this.truckLrg.controllerSig = '';
    }
  }

  update() {
    if (this.checkType === 'Medium') {
      this.truckMid.progress = 0;
      if (this.truckMid.jobNo !== '') {
        this.truckMid.progress = this.truckMid.progress + 1;
      }
      if (this.optionA1 === true || this.optionA2 === true) {
        this.truckMid.progress = this.truckMid.progress + 1;
      }
      this.truckMid.progress = this.truckMid.progress / 2;
      this.afs.collection('inspections').doc(this.truckMid.key).update(this.truckMid);
      if (this.truckMid.progress === 0) {
        var status = 'In Queue';
      } else if (this.truckMid.progress > 0 && this.truckMid.progress < 1) {
        var status = 'In Progress';
      } else if (this.truckMid.progress === 1) {
        var status = 'Completed';
      }
      this.afs.collection('trucks').doc(this.truckMid.truckReg).update({
        washbayStatus: status,
        washbayProgress: this.truckMid.progress,
        timeStamp: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD, HH:mm'),
      });
    } else {
      this.truckLrg.progress = 0;
      if (this.truckLrg.jobNo !== '') {
        this.truckLrg.progress = this.truckLrg.progress + 1;
      }
      if (this.optionA1 === true || this.optionA2 === true) {
        this.truckLrg.progress = this.truckLrg.progress + 1;
      }
      if (this.optionB1 === true || this.optionB2 === true) {
        this.truckLrg.progress = this.truckLrg.progress + 1;
      }
      if (this.optionC1 === true || this.optionC2 === true) {
        this.truckLrg.progress = this.truckLrg.progress + 1;
      }
      if (this.optionD1 === true || this.optionD2 === true) {
        this.truckLrg.progress = this.truckLrg.progress + 1;
      }
      this.truckLrg.progress = this.truckLrg.progress / 5;
      console.log(this.truckLrg.progress)
      this.afs.collection('inspections').doc(this.truckLrg.key).update(this.truckLrg);
      if (this.truckLrg.progress === 0) {
        var status = 'In Queue';
      } else if (this.truckLrg.progress > 0 && this.truckLrg.progress < 1) {
        var status = 'In Progress';
      } else if (this.truckLrg.progress === 1) {
        var status = 'Completed';
      }
      this.afs.collection('trucks').doc(this.truckLrg.truckReg).update({
        washbayStatus: status,
        washbayProgress: this.truckLrg.progress,
        timeStamp: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD, HH:mm'),
      });
    }
  }

  check() {
    if (this.checkType === 'Medium') {
      if (this.truckMid.jobNo !== '') {
        if (this.optionA1 === true || this.optionA2 === true) {
          this.save()
        } else {
          this.alertMsg('Wash')
        }
      } else {
        this.alertMsg('Job Card Number')
      }
    } else if (this.checkType === 'Large') {
      if (this.truckLrg.jobNo !== '') {
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
        this.truckMid.timeOut = moment(new Date().toISOString()).locale('en').format('HH:mm');
        this.truckMid.duration = moment(this.truckMid.timeOut, 'HH:mm').diff(moment(this.truckMid.timeIn, 'HH:mm'), 'minutes', true);

        // Save inspection
        this.update();
        this.router.navigate(['home']);
        this.loading.dismiss();
      });
    } else {
      this.getDevLrg()
      this.loading.present('Saving, Please wait...').then(() => {
        // Calculate time to complete inspection
        this.truckLrg.timeOut = moment(new Date().toISOString()).locale('en').format('HH:mm');
        this.truckLrg.duration = moment(this.truckLrg.timeOut, 'HH:mm').diff(moment(this.truckLrg.timeIn, 'HH:mm'), 'minutes', true);

        // Save inspection
        this.update();
        this.router.navigate(['home']);
        this.loading.dismiss();
      });
    }
  }

  getDevMid() {
    this.truckMid.wash = this.optionA1;
    if (this.deviations.note1 !== '') {
      this.truckMid.deviations.push({ note: this.deviations.note1, photo: this.deviations.photo1 })
    }
    if (this.deviations.note2 !== '') {
      this.truckMid.deviations.push({ note: this.deviations.note2, photo: this.deviations.photo2 })
    }
    if (this.deviations.note3 !== '') {
      this.truckMid.deviations.push({ note: this.deviations.note3, photo: this.deviations.photo3 })
    }
    if (this.deviations.note4 !== '') {
      this.truckMid.deviations.push({ note: this.deviations.note4, photo: this.deviations.photo4 })
    }
  }

  getDevLrg() {
    this.truckLrg.wash = this.optionA1;
    this.truckLrg.chassie = this.optionB1;
    this.truckLrg.sanitize = this.optionC1;
    this.truckLrg.polish = this.optionD1;
    if (this.deviations.note1 !== '') {
      this.truckLrg.deviations.push({ note: this.deviations.note1, photo: this.deviations.photo1 })
    }
    if (this.deviations.note2 !== '') {
      this.truckLrg.deviations.push({ note: this.deviations.note2, photo: this.deviations.photo2 })
    }
    if (this.deviations.note3 !== '') {
      this.truckLrg.deviations.push({ note: this.deviations.note3, photo: this.deviations.photo3 })
    }
    if (this.deviations.note4 !== '') {
      this.truckLrg.deviations.push({ note: this.deviations.note4, photo: this.deviations.photo4 })
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
            } else if (unit === 'photo4') {
              this.deviations.photo4 = url;
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
              } else if (unit === 'photo4') {
                this.deviations.photo4 = url;
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
    } else if (unit === 'photo4') {
      this.deviations.photo4 = '';
    }
  }

  ngOnDestroy() {
    if (this.saved === true) {
    } else {
      if (this.checkType === 'Medium') {
        this.afs.collection('inspections').doc(this.truckMid.key).delete();
      } else if (this.checkType === 'Large') {
        this.afs.collection('inspections').doc(this.truckLrg.key).delete();
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
  changeD1() {
    if (this.optionD1 === false) {
      this.optionD2 = true;
    } else {
      this.optionD2 = false;
    }
    this.update();
  }
  changeD2() {
    if (this.optionD2 === false) {
      this.optionD1 = true;
    } else {
      this.optionD1 = false;
    }
    this.update();
  }

}



*/

