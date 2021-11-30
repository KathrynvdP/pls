import { Component, OnInit, ViewChild } from '@angular/core';
import moment from 'moment';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { AlertController, ModalController } from '@ionic/angular';
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
import { IonicSelectableComponent } from 'ionic-selectable';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss']
})
export class CheckoutPage implements OnInit {
  @ViewChild('fleetNoList', { static: false }) fleetNoList: IonicSelectableComponent;
  saved = false;

  checkout = {
    type: 'checkout', report: 'Check Out', key: '', truckReg: '', truckCheck: '', truckFleet: '', truckFleetNo: '', trailer1Reg: '', trailer1Fleet: '', trailer1KM: '', trailer1Check: '',
    trailer2Reg: '', trailer2Fleet: '', trailer2KM: '', trailer2Check: '', jobNo: '', date: '', code: '',
    timeIn: '', timeOut: '', duration: {},
    driver: '', controller: '', controllerSig: '', totalDur: {}, totalTimeIn: '',
    traps: '', netts: '', belts: '', ratchets: '',
    chains: '', satans: '',
    locks: '', uprights: '', plate: '', fire: '', blocks: '', progress: 0,
  };

  isDrawing = true;

  signaturePadOptions: Object = {
    minWidth: 2,
    backgroundColor: '#fff',
    penColor: '#000',
    canvasWidth: 250
  };

  code;
  type;

  trailer1 = false;
  trailer2 = false;

  correctDriver = true;
  drivers = [];
  driver;

  prevDriver;

  trailers = [];
  trucks = [];

  trailerA;
  trailerB;

  passedForm;

  constructor(public alertCtrl: AlertController, private barcodeScanner: BarcodeScanner, private afs: AngularFirestore,
    public loading: LoadingService, public router: Router, private storage: Storage, public modalCtrl: ModalController,
    public toast: ToastService) { }

  @ViewChild('sigpad', { static: false }) sigPad: SignaturePad;

  ngOnInit() {
    this.checkout.date = moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD');
    this.checkout.timeIn = moment(new Date().toISOString()).locale('en').format('HH:mm');
    this.getTrailers();
    this.getTrucks();
    this.storage.get('user').then(user => {
      this.checkout.controller = user.name;
    });
  }

  getTrailers() {
    this.afs.collection('trailers').ref.orderBy('fleetNo').get().then(trailers => {
      trailers.forEach(trailer => {
        this.trailers.push(trailer.data());
      })
    })
  }

  openSelectable() {
    this.fleetNoList.open();
  }

  getTrucks() {
    this.loading.present("Loading");
    this.afs.firestore.collection("trucks").get().then(trucks => {
      let truckList = [];
      trucks.forEach(truck => {
        if (truck.data().timeStamp !== '') {
          truckList.push(truck.data());
        }
      })
      this.trucks = truckList;
      this.loading.dismiss();
    }).catch(err => { alert(err.message); this.loading.dismiss() })
  }

  onTruckSelected(event){
    let truckInfo = event.value;
    this.checkInspecs(truckInfo.jobNo).then(() => {
        this.checkout.code = truckInfo.registration;
        this.checkout.truckReg = truckInfo.registration;
        this.checkout.truckFleet = truckInfo.fleet;
        this.checkout.truckFleetNo = truckInfo.fleetNo;
        if (truckInfo.authenticated === 'Authorised') {
          this.checkout.truckCheck = truckInfo.checkType;
          this.checkout.driver = truckInfo.driver;
          this.checkout.jobNo = truckInfo.jobNo;
          this.prevDriver = truckInfo.driver;
          this.afs.collection('inspections').doc(this.checkout.key).set(this.checkout, { merge: true });
        } else {
          this.noAuthAlert();
        }
    });
  }

  updateTrailer1(trailer) {
    this.checkout.trailer1Check = trailer.checkType
    this.checkout.trailer1Reg = trailer.registration
    this.checkout.trailer1Fleet = trailer.fleetNo
    console.log(this.checkout.trailer1Check)
  }

  updateTrailer2(trailer) {
    this.checkout.trailer2Check = trailer.checkType
    this.checkout.trailer2Reg = trailer.registration
    this.checkout.trailer2Fleet = trailer.fleetNo
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
      // Using this code to determine the unit type (truck/trailer/driver)
      this.afs.collection('codes').doc(this.code).ref.get().then(async (data: any) => {
        if (data.data()) {
          this.type = data.data().type;
          // Uses this type to search the correct collection. Gets info on unit
          this.afs.collection(this.type).doc(this.code).ref.get().then(async (info:any) => {
            if (info.data()) {
              this.checkInspecs(info.data().jobNo).then(() => {
                if (item === 'truck') {
                  this.checkout.code = this.code
                  this.checkout.truckReg = info.data().registration;
                  this.checkout.truckFleet = info.data().fleet;
                  this.checkout.truckFleetNo = info.data().fleetNo;
                  if (info.data().authenticated === 'Authorised') {
                    this.checkout.truckCheck = info.data().checkType;
                    this.checkout.driver = info.data().driver;
                    this.checkout.jobNo = info.data().jobNo;
                    this.prevDriver = info.data().driver;
                    this.afs.collection('inspections').doc(this.checkout.key).set(this.checkout, { merge: true });
                    if (info.data().firstScan === false) {
                      console.log('Got data');
                    } else {
                      this.updateScan(barcodeData);
                    }
                  } else {
                    this.noAuthAlert();
                  }
                } else if (item === 'trailer1') {
                  this.checkout.trailer1Reg = info.data().registration;
                  this.checkout.trailer1Fleet = info.data().fleetNo;
                  if (info.data().firstScan === false) {
                    console.log('Got data');
                  } else {
                    this.updateScan(barcodeData);
                  }
                } else if (item === 'trailer2') {
                  this.checkout.trailer2Reg = info.data().registration;
                  this.checkout.trailer2Fleet = info.data().fleetNo;
                  if (info.data().firstScan === false) {
                    console.log('Got data');
                  } else {
                    this.updateScan(barcodeData);
                  }
                }
              });
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

  checkInspecs(jobNo) {
    return new Promise<void>((resolve, reject) => {
      // Check if job card exists
      console.log(jobNo)
      if (jobNo !== '') {
        this.afs.collection('inspections').ref.where('jobNo', '==', jobNo).where('type', '==', 'checkout').limit(2).get().then((query: any) => {
          // Check if other inspections exist
          console.log(query.size)
          if (query.size > 0) {
            query.forEach((element: any) => {
              console.log(element.data().timeIn)
              // Check if other inspection is complete
              if (element.data().timeOut !== '') {
                // console.log('Found other check with jobNo')
                this.alert()
                resolve();
              } else {
                this.passedForm = element.data();
                if (this.passedForm) {
                  this.checkout = this.passedForm;
                  console.log('Got other inspection')
                  resolve();
                }
              }
            });
          } else {
            console.log('New inspection')
            this.checkout.key = UUID.UUID();
            resolve();
          }
        })
      } else {
        this.alert()
        resolve();
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

  async noAuthAlert() {
    const prompt = await this.alertCtrl.create({
      header: 'This Truck/Trailer does not have authorisation',
      message: `Please request authorisation before proceeding`,
      cssClass: 'alert',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Request authorisation',
          handler: data => {
            this.loading.present('Requesting, Please Wait...').then(() => {
              this.afs.collection('trucks').doc(this.checkout.truckReg).update({ authenticated: 'Awaiting', authUser: this.checkout.controller, authTime: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD, HH:mm'), timeStamp: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD, HH:mm'), checkoutStatus: 'In Queue', checkoutProgress: 0 });
              this.saved = true;
              var info = {
                key: this.checkout.key,
                status: 'Open',
                code: this.checkout.truckReg,
                fleet: this.checkout.truckFleet,
                fleetNo: this.checkout.truckFleetNo,
                date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
                time: moment(new Date().toISOString()).locale('en').format('HH:mm:ss'),
                from: 'Checkout Request'
              };
              this.afs.collection('requests').doc(info.key).set(info)
              this.router.navigate(['home'])
              this.toast.show('Request Sent Successfully')
              this.loading.dismiss();
            })
          }
        },
      ]
    });
    return await prompt.present();
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
      this.afs.collection('users').ref.where('type', '==', 'Driver').orderBy('name').get().then(drivers => {
        drivers.forEach((driver: any) => {
          this.drivers.push({ ...driver.data(), displayName: driver.data().name + ' ' + driver.data().surname });
        });
      });
    } else {
      this.drivers = [];
    }
  }

  updateDriver() {
    console.log(this.driver.key)
    this.checkout.driver = this.driver.displayName;
    this.afs.collection('trucks').doc(this.checkout.truckReg).update({ driver: this.checkout.driver });
    var log = {
      key: UUID.UUID(),
      date: this.checkout.date,
      time: this.checkout.timeIn,
      type: 'Driver Change',
      vehicle: this.checkout.truckReg,
      prevDriver: this.prevDriver,
      newDriver: this.checkout.driver
    };
    this.afs.collection('logs').doc(log.key).set(log);
    this.afs.collection('users').doc(this.driver.key).update({
      code: this.checkout.code,
      fleet: this.checkout.truckFleet,
      fleetNo: this.checkout.truckFleetNo
    })
  }

  drawStart() {
    this.isDrawing = true;
  }

  drawComplete() {
    this.isDrawing = false;
    this.checkout.controllerSig = this.sigPad.toDataURL();
  }

  clearPad() {
    this.sigPad.clear();
    this.checkout.controllerSig = '';
  }

  update() {
    this.checkout.progress = 0;
    if (this.checkout.date !== '') {
      this.checkout.progress = this.checkout.progress + 1;
    }
    if (this.checkout.driver !== '') {
      this.checkout.progress = this.checkout.progress + 1;
    }
    if (this.checkout.traps !== '') {
      this.checkout.progress = this.checkout.progress + 1;
    }
    if (this.checkout.netts !== '') {
      this.checkout.progress = this.checkout.progress + 1;
    }
    if (this.checkout.belts !== '') {
      this.checkout.progress = this.checkout.progress + 1;
    }
    if (this.checkout.ratchets !== '') {
      this.checkout.progress = this.checkout.progress + 1;
    }
    if (this.checkout.chains !== '') {
      this.checkout.progress = this.checkout.progress + 1;
    }
    if (this.checkout.satans !== '') {
      this.checkout.progress = this.checkout.progress + 1;
    }
    if (this.checkout.locks !== '') {
      this.checkout.progress = this.checkout.progress + 1;
    }
    if (this.checkout.uprights !== '') {
      this.checkout.progress = this.checkout.progress + 1;
    }
    if (this.checkout.plate !== '') {
      this.checkout.progress = this.checkout.progress + 1;
    }
    if (this.checkout.fire !== '') {
      this.checkout.progress = this.checkout.progress + 1;
    }
    if (this.checkout.blocks !== '') {
      this.checkout.progress = this.checkout.progress + 1;
    }
    this.checkout.progress = this.checkout.progress / 13;
    this.afs.collection('inspections').doc(this.checkout.key).update(this.checkout);
    if (this.checkout.progress === 0) {
      var status = 'In Queue';
    } else if (this.checkout.progress > 0 && this.checkout.progress < 1) {
      var status = 'In Progress';
    } else if (this.checkout.progress === 1) {
      var status = 'Completed';
    }
    this.afs.collection('trucks').doc(this.checkout.truckReg).update({
      checkoutStatus: status,
      checkoutProgress: this.checkout.progress,
      timeStamp: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD, HH:mm'),
    });
  }

  check() {
    if (this.checkout.driver !== '') {
      if (this.checkout.traps !== '') {
        if (this.checkout.netts !== '') {
          if (this.checkout.belts !== '') {
            if (this.checkout.ratchets !== '') {
              if (this.checkout.chains !== '') {
                if (this.checkout.satans !== '') {
                  if (this.checkout.locks !== '') {
                    if (this.checkout.uprights !== '') {
                      if (this.checkout.plate !== '') {
                        if (this.checkout.fire !== '') {
                          if (this.checkout.blocks !== '') {
                            if (this.checkout.controllerSig !== '') {
                              this.saved = true;
                              this.save();
                            } else {
                              this.alertMsg('Signature');
                            }
                          } else {
                            this.alertMsg('Stop Blocks');
                          }
                        } else {
                          this.alertMsg('Fire Extinguisher');
                        }
                      } else {
                        this.alertMsg('Plate');
                      }
                    } else {
                      this.alertMsg('Uprights');
                    }
                  } else {
                    this.alertMsg('Locks');
                  }
                } else {
                  this.alertMsg('Satans');
                }
              } else {
                this.alertMsg('Chains');
              }
            } else {
              this.alertMsg('Ratchets');
            }
          } else {
            this.alertMsg('Belts');
          }
        } else {
          this.alertMsg('Netts');
        }
      } else {
        this.alertMsg('Traps');
      }
    } else {
      this.alertMsg('Driver');
    }
  }

  async alertMsg(item) {
    const prompt = await this.alertCtrl.create({
      header: 'Incomplete Check',
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
    this.saved = true;
    this.loading.present('Saving, Please Wait...').then(() => {
      this.checkout.timeOut = moment(new Date().toISOString()).locale('en').format('HH:mm');
      this.checkout.duration = moment(this.checkout.timeOut, 'HH:mm').diff(moment(this.checkout.timeIn, 'HH:mm'), 'minutes', true);
      console.log(this.checkout.duration);
      this.getTotalDur().then(() => {
        this.afs.collection('inspections').doc(this.checkout.key).update(this.checkout);
        this.afs.collection('trucks').doc(this.checkout.truckReg).update({ timeStamp: '', jobNo: '', lastInspection: 'Checkout', lastInspectionTimestamp: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD, HH:mm'), });
        this.changeCheck();
        setTimeout(() => {
          this.router.navigate(['home']);
          this.loading.dismiss();
        }, 2000);
      });
    });
  }

  getTotalDur() {
    return new Promise<void>((resolve, reject) => {
      this.afs.collection('inspections').ref.where('type', '==', 'checkin').where('jobNo', '==', this.checkout.jobNo).limit(1).get().then((checkins: any) => {
        checkins.forEach(check => {
          this.checkout.totalTimeIn = check.data().timeStamp;
          var timeStamp = moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD, HH:mm');
          this.checkout.totalDur = moment(timeStamp, 'YYYY/MM/DD, HH:mm').diff(moment(check.data().timeStamp, 'YYYY/MM/DD, HH:mm'), 'hours', true);
        })
        resolve();
      })
    })
  }

  changeCheck() {
    var check
    if (this.checkout.truckCheck === 'Small') {
      check = 'Medium'
    } else if (this.checkout.truckCheck === 'Medium') {
      check = 'Large'
    } else if (this.checkout.truckCheck === 'Large') {
      check = 'Small';
    }
    this.afs.collection('trucks').doc(this.checkout.truckReg).update({ checkType: check, timeStamp: '', jobNo: '', });
    if (this.checkout.trailer1Reg !== '') {
      if (this.checkout.trailer1Check === 'Small') {
        check = 'Medium'
      } else if (this.checkout.trailer1Check === 'Medium') {
        check = 'Large'
      } else if (this.checkout.trailer1Check === 'Large') {
        check = 'Small';
      }
      this.afs.collection('trailers').doc(this.checkout.trailer1Reg).update({ checkType: check, jobNo: '', });
    }
    if (this.checkout.trailer2Reg !== '') {
      if (this.checkout.trailer2Check === 'Small') {
        check = 'Medium'
      } else if (this.checkout.trailer2Check === 'Medium') {
        check = 'Large'
      } else if (this.checkout.trailer2Check === 'Large') {
        check = 'Small';
      }
      this.afs.collection('trailers').doc(this.checkout.trailer2Reg).update({ checkType: check, jobNo: '', });
    }
  }

  ngOnDestroy() {
    if (this.saved === true) {
    } else {
      console.log('Incomplete')
      // this.afs.collection('inspections').doc(this.checkout.key).delete();
      this.afs.collection('trucks').doc(this.checkout.truckReg).update({ checkoutStatus: 'Incomplete', checkoutProgress: 0 });
    }
  }
}

