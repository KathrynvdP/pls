import { Component, OnInit, ViewChild } from '@angular/core';
import moment from 'moment';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { AlertController, NavController, ModalController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { UUID } from 'angular2-uuid';
import { Storage } from '@ionic/storage';
import { LoadingService } from '../services/loading.service';
import { Router } from '@angular/router';
import { AddItemPage } from '../add-item/add-item.page';
import { ToastService } from '../services/toast.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { dismantleLicDisk } from '../utils/utility';
import { UpdateItemPage } from '../update-item/update-item.page';

@Component({
  selector: 'app-security-check',
  templateUrl: './security-check.page.html',
  styleUrls: ['./security-check.page.scss'],
})
export class SecurityCheckPage implements OnInit {

  security = {
    type: 'security', key: '', truckReg: '', truckKM: '', truckCheck: '', trailer1Reg: '', trailer1KM: '', trailer1Check: '',
    trailer2Reg: '', trailer2KM: '', trailer2Check: '', jobNo: '', date: '',
    timeIn: '', timeOut: '', duration: {},
    driver: '', bayNo: '', controller: '', controllerSig: '', progress: 0,
  };

  code;
  type;

  trailer1 = false;
  trailer2 = false;

  isDrawing = true;
  sigValue = true;

  signaturePadOptions: Object = {
    minWidth: 2,
    backgroundColor: '#fff',
    penColor: '#000',
    canvasWidth: 250
  };

  correctDriver = true;
  drivers = [];

  prevDriver;

  constructor(public alertCtrl: AlertController, private barcodeScanner: BarcodeScanner, private afs: AngularFirestore,
    public loading: LoadingService, public router: Router, private storage: Storage, public modalCtrl: ModalController,
    public toast: ToastService) { }

  @ViewChild('sigpad', { static: false }) sigPad: SignaturePad;

  ngOnInit() {
    this.security.date = moment(new Date().toISOString()).locale('en').format('DD/MM/YYYY');
    this.security.timeIn = moment(new Date().toISOString()).locale('en').format('HH:mm');
    this.security.key = UUID.UUID();
    this.storage.get('user').then(user => {
      this.security.controller = user.name;
    });
    this.afs.collection('inspections').doc(this.security.key).set(this.security);
  }

  async scan(item) {

    this.barcodeScanner.scan({
      showTorchButton: true,
      showFlipCameraButton: true,
      formats: 'QR_CODE,PDF_417'
    }).then(barcodeData => {
      console.log(dismantleLicDisk(barcodeData));

      // Getting barcode
      this.code = dismantleLicDisk(barcodeData).RegNum;
      // Using this code to determine the unit type (trucks/trailer/driver)
      this.afs.collection('codes').doc(this.code).ref.get().then(async (data: any) => {
        if (data.data()) {
          this.type = data.data().type;
          // Uses this type to search the correct collection. Gets info on unit
          this.afs.collection(this.type).doc(this.code).ref.get().then((info: any) => {
            if (info.data()) {
              if (item === 'truck') {
                this.security.truckReg = info.data().registration;
                if (info.data().checkType === 'Small') {
                  this.security.truckCheck = 'Medium';
                } else if (info.data().checkType === 'Medium') {
                  this.security.truckCheck = 'Large';
                } else if (info.data().checkType === 'Large') {
                  this.security.truckCheck = 'Small';
                }
                this.afs.collection(this.type).doc(this.code).update({ checkType: this.security.truckCheck });
                this.security.driver = info.data().driver;
                this.prevDriver = info.data().driver;
                if (info.data().firstScan === false) {
                  console.log('Got data');
                } else {
                  this.updateScan(barcodeData);
                }
              } else if (item === 'trailer1') {
                this.security.trailer1Reg = info.data().registration;
                if (info.data().checkType === 'Small') {
                  this.security.trailer1Check = 'Medium';
                } else if (info.data().checkType === 'Medium') {
                  this.security.trailer1Check = 'Large';
                } else if (info.data().checkType === 'Large') {
                  this.security.trailer1Check = 'Small';
                }
                this.afs.collection(this.type).doc(this.code).update({ checkType: this.security.trailer1Check });
                if (info.data().firstScan === false) {
                  console.log('Got data');
                } else {
                  this.updateScan(barcodeData);
                }
              } else if (item === 'trailer2') {
                this.security.trailer2Reg = info.data().registration;
                if (info.data().checkType === 'Small') {
                  this.security.trailer2Check = 'Medium';
                } else if (info.data().checkType === 'Medium') {
                  this.security.trailer2Check = 'Large';
                } else if (info.data().checkType === 'Large') {
                  this.security.trailer2Check = 'Small';
                }
                this.afs.collection(this.type).doc(this.code).update({ checkType: this.security.trailer2Check });
                if (info.data().firstScan === false) {
                  console.log('Got data');
                } else {
                  this.updateScan(barcodeData);
                }
              }
            }
          });
        } else {
          const prompt = await this.alertCtrl.create({
            header: 'This Truck/Trailer does not exist',
            message: `Please add it before continuing.`,
            cssClass: 'alert',
            buttons: [
              {
                text: 'Add Truck/Trailer',
                handler: data => {
                  this.add().then(() => {
                    this.toast.show('Item added. Please scan again.');
                  });
                }
              },
            ]
          });
          return await prompt.present();
        }
      });
    }).catch(err => {
      alert('Error' + err);
    });
  }

  async updateScan(barcodeData) {
    var update = {
      code: dismantleLicDisk(barcodeData).RegNum,
      registration: dismantleLicDisk(barcodeData).RegNum,
      colour: dismantleLicDisk(barcodeData).carColour,
      make: dismantleLicDisk(barcodeData).carMake,
      model: dismantleLicDisk(barcodeData).carModel,
      desc: dismantleLicDisk(barcodeData).carType,
      engineNo: dismantleLicDisk(barcodeData).engineNum,
      vinNo: dismantleLicDisk(barcodeData).vinNum,
      firstScan: false,
    };
    this.afs.collection(this.type).doc(this.code).update(update);
    const modal = await this.modalCtrl.create({
      component: UpdateItemPage,
      componentProps: { type: this.type, code: this.code }
    });
    return await modal.present();
  }

  async add() {
    const modal = await this.modalCtrl.create({
      component: AddItemPage,
      componentProps: { code: this.code }
    });
    return await modal.present();
  }

  getDrivers() {
    console.log(this.correctDriver);
    if (this.correctDriver === false) {
      this.afs.collection('users').ref.where('type', '==', 'Driver').get().then(drivers => {
        drivers.forEach(driver => {
          this.drivers.push(driver.data());
        });
      });
    } else {
      this.drivers = [];
    }
  }

  updateDriver() {
    this.afs.collection('trucks').doc(this.security.truckReg).update({ driver: this.security.driver });
    var log = {
      key: UUID.UUID(),
      date: this.security.date,
      time: this.security.timeIn,
      type: 'Driver Change',
      vehicle: this.security.truckReg,
      prevDriver: this.prevDriver,
      newDriver: this.security.driver
    };
    this.afs.collection('logs').doc(log.key).set(log);
    this.afs.collection('trucks').doc(this.security.truckReg).update({ driver: this.security.driver });
    this.afs.collection('users').ref.where('name', '==', this.security.driver).get().then(drivers => {
      drivers.forEach((driver: any) => {
        this.afs.collection('users').doc(driver.data().key).update({ truck: this.security.truckReg });
      });
    });
  }

  drawStart() {
    this.isDrawing = true;
  }

  drawComplete() {
    this.isDrawing = false;
    this.security.controllerSig = this.sigPad.toDataURL();
  }

  clearPad() {
    this.sigPad.clear();
    this.security.controllerSig = '';
  }

  update() {
    this.security.progress = 0;
    if (this.security.date !== '') {
      this.security.progress = this.security.progress + 1;
    }
    if (this.security.truckKM !== '') {
      this.security.progress = this.security.progress + 1;
    }
    if (this.security.jobNo !== '') {
      this.afs.collection('trucks').doc(this.security.truckReg).update({ jobNo: this.security.jobNo })
      if (this.security.trailer1Reg) {
        this.afs.collection('trailers').doc(this.security.trailer1Reg).update({ jobNo: this.security.jobNo })
      }
      if (this.security.trailer2Reg) {
        this.afs.collection('trailers').doc(this.security.trailer2Reg).update({ jobNo: this.security.jobNo })
      }
      this.security.progress = this.security.progress + 1;
    }
    if (this.security.driver !== '') {
      this.security.progress = this.security.progress + 1;
    }
    if (this.security.bayNo !== '') {
      this.security.progress = this.security.progress + 1;
    }
    if (this.security.controllerSig !== '') {
      this.security.progress = this.security.progress + 1;
    }
    this.security.progress = this.security.progress / 6;
    this.afs.collection('inspections').doc(this.security.key).update(this.security);
  }

  check() {
    if (this.security.truckKM !== '') {
      if (this.security.bayNo !== '') {
        if (this.security.jobNo !== '') {
          this.save();
        } else {
          this.alertMsg('Job Number');
        }
      } else {
        this.alertMsg('Bay Number');
      }
    } else {
      this.alertMsg('Truck KM');
    }
  }

  async alertMsg(item) {
    const prompt = await this.alertCtrl.create({
      header: 'Incomplete CheckIn',
      message: `Please complete the following checks before saving: ${item}`,
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
      this.security.timeOut = moment(new Date().toISOString()).locale('en').format('HH:mm');
      this.security.duration = moment(this.security.timeOut, 'HH:mm').diff(moment(this.security.timeIn, 'HH:mm'), 'minutes', true);
      console.log(this.security.duration);
      this.afs.collection('inspections').doc(this.security.key).update(this.security);
      if (this.security.truckCheck === 'Small') {
        this.afs.collection('trucks').doc(this.security.truckReg).update({
          washbayStatus: 'Not Required',
          washbayProgress: 0,
          equipmentStatus: 'In Queue',
          equipmentProgress: 0,
          workshopStatus: 'In Queue',
          workshopProgress: 0,
          tyrebayStatus: 'In Queue',
          tyrebayProgress: 0,
          dieselbayStatus: 'In Queue',
          dieselbayProgress: 0,
          trailer: this.security.trailer1Reg,
          bayNo: this.security.bayNo,
          driver: this.security.driver,
          timeStamp: moment(new Date().toISOString()).locale('en').format('DD/MM/YYYY, HH:mm'),
        });
      } else {
        this.afs.collection('trucks').doc(this.security.truckReg).update({
          washbayStatus: 'In Queue',
          washbayProgress: 0,
          equipmentStatus: 'In Queue',
          equipmentProgress: 0,
          workshopStatus: 'In Queue',
          workshopProgress: 0,
          tyrebayStatus: 'In Queue',
          tyrebayProgress: 0,
          dieselbayStatus: 'In Queue',
          dieselbayProgress: 0,
          trailer: this.security.trailer1Reg,
          bayNo: this.security.bayNo,
          driver: this.security.driver,
          timeStamp: moment(new Date().toISOString()).locale('en').format('DD/MM/YYYY, HH:mm'),
        });
      }
      this.router.navigate(['home']);
      this.loading.dismiss();
    });
  }
}
