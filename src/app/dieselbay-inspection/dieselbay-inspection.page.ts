import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import moment from 'moment';
import { UUID } from 'angular2-uuid';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { Storage } from '@ionic/storage';
import { LoadingService } from '../services/loading.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-dieselbay-inspection',
  templateUrl: './dieselbay-inspection.page.html',
  styleUrls: ['./dieselbay-inspection.page.scss'],
})
export class DieselbayInspectionPage implements OnInit {

  code;
  type;
  checkType;

  truck = {
    type: 'dieselbay', report: 'Diesel Bay Check', key: '', code: '', date: '', timeIn: '', timeOut: '', duration: {}, truckReg: '', truckFleet: '', truckFleetNo: '', checkType: '', jobNo: '',
    controller: '', controllerSig: '',
    orderNo: '', truckLit: '', trailer: false, trailerLit: '', progress: 0,
  };

  isDrawing = true;

  signaturePadOptions: Object = {
    minWidth: 2,
    backgroundColor: '#fff',
    penColor: '#000',
    canvasWidth: 250
  };

  optionA1;
  optionA2;

  saved = false;

  @ViewChild('sigpad', { static: false }) sigPad: SignaturePad;

  constructor(public activatedRoute: ActivatedRoute, public router: Router, private storage: Storage, private afs: AngularFirestore,
    public loading: LoadingService, public alertCtrl: AlertController) { }

  ngOnInit() {
    this.code = this.activatedRoute.snapshot.paramMap.get('id1');
    this.type = this.activatedRoute.snapshot.paramMap.get('id2');

    this.storage.get('user').then(user => {
      this.afs.collection('trucks').doc(this.code).ref.get().then((truck: any) => {
        this.truck.code = this.code;
        this.truck.checkType = truck.data().checkType;
        this.truck.truckReg = truck.data().registration;
        this.truck.truckFleet = truck.data().fleet;
        this.truck.truckFleetNo = truck.data().fleetNo;
        var string = truck.data().jobNo
        this.truck.jobNo = string
        this.truck.controller = user.name;
        this.truck.date = moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD');
        this.truck.timeIn = moment(new Date().toISOString()).locale('en').format('HH:mm');
        this.truck.key = UUID.UUID();
        this.afs.collection('inspections').doc(this.truck.key).set(this.truck);
      });
    });
  }

  drawStart() {
    this.isDrawing = true;
  }

  drawComplete() {
    this.isDrawing = false;
    this.truck.controllerSig = this.sigPad.toDataURL();
  }

  clearPad() {
    this.sigPad.clear();
    this.truck.controllerSig = '';
  }

  update() {
    this.truck.progress = 0;
    if (this.truck.jobNo !== '') {
      this.truck.progress = this.truck.progress + 1;
    }
    if (this.truck.orderNo !== '') {
      this.truck.progress = this.truck.progress + 1;
    }
    if (this.truck.truckLit !== '') {
      this.truck.progress = this.truck.progress + 1;
    }
    if (this.optionA1 !== '') {
      this.truck.progress = this.truck.progress + 1;
    }
    this.truck.progress = this.truck.progress / 4;
    this.afs.collection('inspections').doc(this.truck.key).update(this.truck);
    if (this.truck.progress === 0) {
      var status = 'In Queue';
    } else if (this.truck.progress > 0 && this.truck.progress < 1) {
      var status = 'In Progress';
    } else if (this.truck.progress === 1) {
      var status = 'Completed';
    }
    this.afs.collection('trucks').doc(this.truck.truckReg).update({
      dieselbayStatus: status,
      dieselbayProgress: this.truck.progress,
      timeStamp: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD, HH:mm'),
    });
  }

  save() {
    this.sendReq();
    this.saved = true
    this.truck.trailer = this.optionA1;
    this.loading.present('Saving, Please wait...').then(() => {
      this.truck.timeOut = moment(new Date().toISOString()).locale('en').format('HH:mm');
      this.truck.duration = moment(this.truck.timeOut, 'HH:mm').diff(moment(this.truck.timeIn, 'HH:mm'), 'minutes', true);

      // Save inspection
      this.afs.collection('inspections').doc(this.truck.key).update(this.truck);
      this.router.navigate(['home']);
      this.loading.dismiss();
    });
  }

  sendReq() {
    var info = {
      key: UUID.UUID(),
      status: 'Open',
      code: this.truck.code,
      fleet: this.truck.truckFleet,
      fleetNo: this.truck.truckFleetNo,
      date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
      time: moment(new Date().toISOString()).locale('en').format('HH:mm:ss'),
      from: 'Diesel Auto Request'
    };
    this.afs.collection('requests').doc(info.key).set(info)
    this.afs.collection('trucks').doc(this.truck.truckReg).update({ authenticated: 'Awaiting', authUser: 'Automatic Auth', authTime: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD, HH:mm'), lastInspection: 'Diesel Bay', lastInspectionTimestamp: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD, HH:mm'), })
  }

  check() {
    if (this.truck.jobNo !== '') {
      if (this.truck.orderNo !== '') {
        if (this.truck.truckLit !== '') {
          if (this.optionA1 !== '') {
            if (this.truck.controllerSig !== '') {
              this.save();
            } else {
              this.alertMsg('Signature')
            }
          } else {
            this.alertMsg('Does this truck have a trailer')
          }
        } else {
          this.alertMsg('Truck Liters')
        }
      } else {
        this.alertMsg('Order Number')
      }
    } else {
      this.alertMsg('Job Card Number')
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

  ngOnDestroy() {
    if (this.saved === true) {
    } else {
      this.afs.collection('inspections').doc(this.truck.key).delete();
      this.afs.collection('trucks').doc(this.truck.code).update({ dieselbayStatus: 'Skipped', dieselbayProgress: 0 });
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
}

