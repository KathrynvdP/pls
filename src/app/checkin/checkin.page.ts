import { Component, OnInit, ViewChild } from '@angular/core';
import moment from 'moment';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { AlertController, ModalController, Platform } from '@ionic/angular';
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
  selector: 'app-checkin',
  templateUrl: './checkin.page.html',
  styleUrls: ['./checkin.page.scss'],
})
export class CheckinPage implements OnInit {

  saved = false;

  checkin = {
    type: 'checkin', report: 'Check In', key: '', truckReg: '', truckKM: '', truckCheck: '', truckFleet: '', truckFleetNo: '', trailer1Reg: '', trailer1Fleet: '', trailer1KM: '', trailer1Check: '',
    trailer2Reg: '', trailer2Fleet: '', trailer2KM: '', trailer2Check: '', jobNo: '', date: '', code: '',
    timeIn: '', timeOut: '', duration: {}, timeStamp: '',
    driver: '', driverKey: '', bayNo: '', controller: '', controllerSig: '',
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
  trailerA;
  trailerB;

  trailers = [];
  trucks = [];

  correctDriver = true;
  drivers = [];
  driver;

  bays = [];

  prevDriver;
  platformSubsrciption;

  someList = [{ name: 'hello', key: 0 }, { name: 'helloo', key: 0 }, { name: 'hellooo', key: 0 }, { name: 'hellooooo', key: 0 }];

  constructor(public alertCtrl: AlertController, private barcodeScanner: BarcodeScanner, private afs: AngularFirestore,
    public loading: LoadingService, public router: Router, private storage: Storage, public modalCtrl: ModalController,
    public toast: ToastService,
    private platform: Platform) { }

  @ViewChild('sigpad', { static: false }) sigPad: SignaturePad;
  @ViewChild('fleetNoList', { static: false }) fleetNoList: IonicSelectableComponent;
  ngOnInit() {
    this.checkin.date = moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD');
    this.checkin.timeIn = moment(new Date().toISOString()).locale('en').format('HH:mm');
    this.checkin.timeStamp = moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD, HH:mm');
    this.checkin.key = UUID.UUID();
    var number = Math.random().toString().slice(2, 12);
    this.checkin.jobNo = 'PLS' + number
    // this.getBays();
    this.getTrailers();
    this.getTrucks();
    this.storage.get('user').then(user => {
      this.checkin.controller = user.name;
      console.log('Saved')
      this.afs.collection('inspections').doc(this.checkin.key).set(this.checkin);
    });
  }

  async ionViewDidEnter() {
    console.log('did enter triggered')
    this.platformSubsrciption = this.platform.pause.subscribe(async () => {
      console.log("App minimized");
      if (this.saved === true) {
        console.log("Check has been saved");
      } else {
        console.log('Not saved');
        this.afs.collection('inspections').doc(this.checkin.key).delete();
        if (this.checkin.code !== '') {
          this.afs.collection('trucks').doc(this.checkin.code).update({ checkinStatus: 'Skipped', checkinProgress: 0, timeStamp: '', jobNo: '', bayNo: '', });
        }
      }
    })
  }

  openSelectable() {
    this.fleetNoList.open();
  }

  getTrucks() {
    this.loading.present("Loading");
    this.afs.firestore.collection("trucks").where("timeStamp", "==", "").get().then(trucks => {
      let truckList = [];
      trucks.forEach(truck => {
        truckList.push(truck.data());
      })
      this.trucks = truckList;
      this.loading.dismiss();
    }).catch(err => { alert(err.message); this.loading.dismiss() })
  }
  onTruckSelected(ev) {
    let truckInfo = ev.value;
    console.log(truckInfo)
    if (truckInfo.jobNo === '' && truckInfo.timeStamp === '') {
      this.checkin.code = truckInfo.code;
      this.checkin.truckReg = truckInfo.code;
      this.checkin.truckCheck = truckInfo.checkType;
      this.checkin.truckFleet = truckInfo.fleet;
      this.checkin.truckFleetNo = truckInfo.fleetNo;
      this.checkin.driver = truckInfo.driver;
      this.prevDriver = truckInfo.driver;
    } else {
      this.noCheckin()
    }
    this.afs.collection('trucks').doc(this.checkin.truckReg).update({
      washbayStatus: 'In Queue',
      washbayProgress: 0,
      checkinStatus: 'In Queue',
      checkinProgress: 0,
      checkoutStatus: 'In Queue',
      checkoutProgress: 0,
      workshopStatus: 'In Queue',
      workshopProgress: 0,
      tyrebayStatus: 'In Queue',
      tyrebayProgress: 0,
      dieselbayStatus: 'In Queue',
      dieselbayProgress: 0,
      timeStamp: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD, HH:mm'),
      authUser: '',
      authenticated: 'In Yard',
      timeCheckIn: this.checkin.timeIn,
      dateCheckIn: this.checkin.date
    });
  }
  // async subscribeToPage(){

  // }

  /*
  getBays() {
    this.afs.collection('bays').ref.where('available', '==', true).orderBy('code').limit(1).get().then(bays => {
      bays.forEach(bay => {
        this.checkin.bayNo = bay.data().number
      })
    })
  }
  */
  //     <resource-file src="resources/icon.png" target="app/src/main/res/mipmap/icon.png" />

  getTrailers() {
    this.afs.collection('trailers').ref.orderBy('fleetNo').get().then(trailers => {
      trailers.forEach(trailer => {
        this.trailers.push(trailer.data());
      })
    })
  }

  async scan(item) {
    this.platformSubsrciption.unsubscribe();
    console.log("unsubscribed");
    this.barcodeScanner.scan({
      showTorchButton: true,
      showFlipCameraButton: true,
      formats: 'QR_CODE,PDF_417'
    }).then(barcodeData => {
      this.ionViewDidEnter();
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
                if (info.data().jobNo === '' && info.data().timeStamp === '') {
                  this.checkin.code = this.code;
                  this.checkin.truckReg = info.data().registration;
                  this.checkin.truckCheck = info.data().checkType;
                  this.checkin.truckFleet = info.data().fleet;
                  this.checkin.truckFleetNo = info.data().fleetNo;
                  this.checkin.driver = info.data().driver;
                  this.prevDriver = info.data().driver;
                  if (info.data().firstScan === false) {
                    console.log('Got data');
                  } else {
                    this.updateScan(barcodeData);
                  }
                } else {
                  this.noCheckin()
                }
                this.afs.collection('trucks').doc(this.checkin.truckReg).update({
                  washbayStatus: 'In Queue',
                  washbayProgress: 0,
                  checkinStatus: 'In Queue',
                  checkinProgress: 0,
                  checkoutStatus: 'In Queue',
                  checkoutProgress: 0,
                  workshopStatus: 'In Queue',
                  workshopProgress: 0,
                  tyrebayStatus: 'In Queue',
                  tyrebayProgress: 0,
                  dieselbayStatus: 'In Queue',
                  dieselbayProgress: 0,
                  timeStamp: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD, HH:mm'),
                  authUser: '',
                  authenticated: 'In Yard',
                  timeCheckIn: this.checkin.timeIn,
                  dateCheckIn: this.checkin.date
                });
              } else if (item === 'trailer1') {
                this.checkin.trailer1Reg = info.data().registration;
                this.checkin.trailer1Fleet = info.data().fleetNo;
                this.checkin.trailer1Check = info.data().checkType;
                if (info.data().firstScan === false) {
                  console.log('Got data');
                } else {
                  this.updateScan(barcodeData);
                }
                this.afs.collection('trailers').doc(this.checkin.trailer1Reg).update({
                  washbayStatus: 'In Queue',
                  washbayProgress: 0,
                  checkinStatus: 'In Queue',
                  checkinProgress: 0,
                  checkoutStatus: 'In Queue',
                  checkoutProgress: 0,
                  workshopStatus: 'In Queue',
                  workshopProgress: 0,
                  tyrebayStatus: 'In Queue',
                  tyrebayProgress: 0,
                  dieselbayStatus: 'In Queue',
                  dieselbayProgress: 0,
                  timeStamp: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD, HH:mm'),
                  authUser: '',
                  authenticated: 'In Yard'
                });
              } else if (item === 'trailer2') {
                this.checkin.trailer2Reg = info.data().registration;
                this.checkin.trailer2Fleet = info.data().fleetNo;
                this.checkin.trailer2Check = info.data().checkType;
                if (info.data().firstScan === false) {
                  console.log('Got data');
                } else {
                  this.updateScan(barcodeData);
                }
                this.afs.collection('trailers').doc(this.checkin.trailer2Reg).update({
                  washbayStatus: 'In Queue',
                  washbayProgress: 0,
                  checkinStatus: 'In Queue',
                  checkinProgress: 0,
                  checkoutStatus: 'In Queue',
                  checkoutProgress: 0,
                  workshopStatus: 'In Queue',
                  workshopProgress: 0,
                  tyrebayStatus: 'In Queue',
                  tyrebayProgress: 0,
                  dieselbayStatus: 'In Queue',
                  dieselbayProgress: 0,
                  timeStamp: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD, HH:mm'),
                  authUser: '',
                  authenticated: 'In Yard'
                });
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

  async noCheckin() {
    const prompt = await this.alertCtrl.create({
      header: 'Incomplete Check',
      message: `This Truck did not get checked out. Please check it out before continuing.`,
      cssClass: 'alert',
      backdropDismiss: false,
      buttons: [
        {
          text: 'OK',
          handler: data => {
            this.router.navigate(['home']);
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

  updateDriver(driver) {
    this.checkin.driver = driver.displayName;
    this.checkin.driverKey = driver.key
    this.afs.collection('trucks').doc(this.checkin.truckReg).update({ driver: this.checkin.driver });
    var log = {
      key: UUID.UUID(),
      date: this.checkin.date,
      time: this.checkin.timeIn,
      type: 'Driver Change',
      vehicle: this.checkin.truckReg,
      prevDriver: this.prevDriver,
      newDriver: this.checkin.driver
    };
    this.afs.collection('logs').doc(log.key).set(log);
    this.afs.collection('trucks').doc(this.checkin.truckReg).update({ driver: this.checkin.driver });
    this.afs.collection('users').doc(driver.key).update({
      code: this.checkin.code,
      fleet: this.checkin.truckFleet,
      fleetNo: this.checkin.truckFleetNo
    })
  }

  updateTrailer1(trailer) {
    this.checkin.trailer1Check = trailer.checkType
    this.checkin.trailer1Reg = trailer.registration
    this.checkin.trailer1Fleet = trailer.fleetNo
    console.log(this.checkin.trailer1Check)
  }

  updateTrailer2(trailer) {
    this.checkin.trailer2Check = trailer.checkType
    this.checkin.trailer2Reg = trailer.registration
    this.checkin.trailer2Fleet = trailer.fleetNo
  }

  drawStart() {
    this.isDrawing = true;
  }

  drawComplete() {
    this.isDrawing = false;
    this.checkin.controllerSig = this.sigPad.toDataURL();
  }

  clearPad() {
    this.sigPad.clear();
    this.checkin.controllerSig = '';
  }

  update() {
    this.checkin.progress = 0;
    if (this.checkin.date !== '') {
      this.checkin.progress = this.checkin.progress + 1;
    }
    if (this.checkin.truckKM !== '') {
      this.checkin.progress = this.checkin.progress + 1;
      this.afs.collection('trucks').doc(this.checkin.truckReg).update({ KM: this.checkin.truckKM })
    }
    if (this.checkin.jobNo !== '') {
      this.checkin.progress = this.checkin.progress + 1;
      this.afs.collection('trucks').doc(this.checkin.truckReg).update({ jobNo: this.checkin.jobNo })
      if (this.checkin.trailer1Reg !== '') {
        this.afs.collection('trailers').doc(this.checkin.trailer1Reg).update({ jobNo: this.checkin.jobNo })
      }
      if (this.checkin.trailer2Reg !== '') {
        this.afs.collection('trailers').doc(this.checkin.trailer2Reg).update({ jobNo: this.checkin.jobNo })
      }
    }
    if (this.checkin.driver !== '') {
      this.checkin.progress = this.checkin.progress + 1;
    }
    /*
    if (this.checkin.bayNo !== '') {
      this.afs.collection('bays').doc(this.checkin.bayNo).update({ available: false })
      this.afs.collection('trucks').doc(this.checkin.truckReg).update({ bayNo: this.checkin.bayNo })
      this.checkin.progress = this.checkin.progress + 1;
    }
    */
    if (this.checkin.traps !== '') {
      this.checkin.progress = this.checkin.progress + 1;
    }
    if (this.checkin.netts !== '') {
      this.checkin.progress = this.checkin.progress + 1;
    }
    if (this.checkin.belts !== '') {
      this.checkin.progress = this.checkin.progress + 1;
    }
    if (this.checkin.ratchets !== '') {
      this.checkin.progress = this.checkin.progress + 1;
    }
    if (this.checkin.chains !== '') {
      this.checkin.progress = this.checkin.progress + 1;
    }
    if (this.checkin.satans !== '') {
      this.checkin.progress = this.checkin.progress + 1;
    }
    if (this.checkin.locks !== '') {
      this.checkin.progress = this.checkin.progress + 1;
    }
    if (this.checkin.uprights !== '') {
      this.checkin.progress = this.checkin.progress + 1;
    }
    if (this.checkin.plate !== '') {
      this.checkin.progress = this.checkin.progress + 1;
    }
    if (this.checkin.fire !== '') {
      this.checkin.progress = this.checkin.progress + 1;
    }
    if (this.checkin.blocks !== '') {
      this.checkin.progress = this.checkin.progress + 1;
    }
    this.checkin.progress = this.checkin.progress / 15;
    this.afs.collection('inspections').doc(this.checkin.key).update(this.checkin);
    if (this.checkin.progress === 0) {
      var status = 'In Queue';
    } else if (this.checkin.progress > 0 && this.checkin.progress < 1) {
      var status = 'In Progress';
    } else if (this.checkin.progress === 1) {
      var status = 'Completed';
    }
    this.afs.collection('trucks').doc(this.checkin.truckReg).update({
      checkinStatus: status,
      checkinProgress: this.checkin.progress,
      timeStamp: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD, HH:mm'),
    });
  }

  check() {
    this.update();
    if (this.checkin.truckKM !== '') {
      if (this.checkin.jobNo !== '') {
        if (this.checkin.driver !== '') {
          //if (this.checkin.bayNo !== '') {
          if (this.checkin.traps !== '') {
            if (this.checkin.netts !== '') {
              if (this.checkin.belts !== '') {
                if (this.checkin.ratchets !== '') {
                  if (this.checkin.chains !== '') {
                    if (this.checkin.satans !== '') {
                      if (this.checkin.locks !== '') {
                        if (this.checkin.uprights !== '') {
                          if (this.checkin.plate !== '') {
                            if (this.checkin.fire !== '') {
                              if (this.checkin.blocks !== '') {
                                if (this.checkin.controllerSig !== '') {
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
          /*
        } else {
          this.alertMsg('Bay Number');
        }
        */
        } else {
          this.alertMsg('Driver');
        }
      } else {
        this.alertMsg('Job Number');
      }
    } else {
      this.alertMsg('Truck KM');
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
      this.checkin.timeOut = moment(new Date().toISOString()).locale('en').format('HH:mm');
      this.checkin.duration = moment(this.checkin.timeOut, 'HH:mm').diff(moment(this.checkin.timeIn, 'HH:mm'), 'minutes', true);
      console.log(this.checkin.duration);
      this.afs.collection('inspections').doc(this.checkin.key).update(this.checkin);
      this.saveCheck();
      if (this.checkin.truckCheck === 'Small') {
        this.afs.collection('trucks').doc(this.checkin.truckReg).update({
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
          trailer1: this.checkin.trailer1Fleet,
          trailer2: this.checkin.trailer2Fleet,
          // bayNo: this.checkin.bayNo,
          driver: this.checkin.driver,
          timeStamp: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD, HH:mm'),
          lastInspection: 'Checkin',
          lastInspectionTimestamp: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD, HH:mm'),
        });
      } else {
        this.afs.collection('trucks').doc(this.checkin.truckReg).update({
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
          trailer1: this.checkin.trailer1Fleet,
          trailer2: this.checkin.trailer2Fleet,
          // bayNo: this.checkin.bayNo,
          driver: this.checkin.driver,
          timeStamp: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD, HH:mm'),
          lastInspection: 'Checkin',
          lastInspectionTimestamp: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD, HH:mm'),
        });
      }
      setTimeout(() => {
        this.router.navigate(['home']);
        this.loading.dismiss();
      }, 2000);
    });
  }

  saveCheck() {
    var info = {
      key: this.checkin.key,
      status: 'Open',
      code: this.checkin.truckReg,
      fleet: this.checkin.truckFleet,
      fleetNo: this.checkin.truckFleetNo
    };
    this.afs.collection('checkins').doc(info.key).set(info)
  }

  ngOnDestroy() {
    if (this.saved === true) {
    } else {
      console.log('Not saved')
      this.afs.collection('inspections').doc(this.checkin.key).delete();
      if (this.checkin.code !== '') {
        this.afs.collection('trucks').doc(this.checkin.code).update({ checkinStatus: 'Skipped', checkinProgress: 0, timeStamp: '', jobNo: '', bayNo: '', });
      }
    }
  }
}

