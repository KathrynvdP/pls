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
  selector: 'app-equipment-inspection',
  templateUrl: './equipment-inspection.page.html',
  styleUrls: ['./equipment-inspection.page.scss'],
})
export class EquipmentInspectionPage implements OnInit {

  code;
  type;
  checkType;

  truck = {
    type: 'equipment', key: '', code: '', date: '', timeIn: '', timeOut: '', duration: {}, truckReg: '', checkType: '', jobNo: '',
    controller: '', controllerSig: '',
    traps: '', netts: '', belts: '', chains: '', satans: '', locks: '', uprights: '', plate: '', progress: 0,
  };

  trailer = {
    type: 'equipment', key: '', code: '', date: '', timeIn: '', timeOut: '', duration: {}, trailerReg: '', trailerKM: '', checkType: '', jobNo: '', controller: '', controllerSig: '',
    traps: '', netts: '', belts: '', chains: '', satans: '', locks: '', uprights: '', plate: '', progress: 0,
  };

  isDrawing = true;

  signaturePadOptions: Object = {
    minWidth: 2,
    backgroundColor: '#fff',
    penColor: '#000',
    canvasWidth: 250
  };

  @ViewChild('sigpad', { static: false }) sigPad: SignaturePad;

  constructor(public activatedRoute: ActivatedRoute, public router: Router, private storage: Storage, private afs: AngularFirestore,
    public loading: LoadingService, public alertCtrl: AlertController) { }

  ngOnInit() {
    this.code = this.activatedRoute.snapshot.paramMap.get('id1');
    this.type = this.activatedRoute.snapshot.paramMap.get('id2');
    this.checkType = this.activatedRoute.snapshot.paramMap.get('id3');

    this.storage.get('user').then(user => {
      if (this.type === 'trucks') {
        this.afs.collection('trucks').doc(this.code).ref.get().then((truck: any) => {
          this.truck.code = this.code;
          this.truck.checkType = truck.data().checkType;
          this.truck.truckReg = truck.data().registration;
          this.truck.controller = user.name;
          this.truck.date = moment(new Date().toISOString()).locale('en').format('DD/MM/YYYY');
          this.truck.timeIn = moment(new Date().toISOString()).locale('en').format('HH:mm');
          this.truck.key = UUID.UUID();
          this.afs.collection('inspections').doc(this.truck.key).set(this.truck);
        });
      } else {
        this.afs.collection('trailers').doc(this.code).ref.get().then((trailer: any) => {
          this.trailer.code = this.code;
          this.trailer.checkType = this.checkType;
          this.trailer.trailerReg = trailer.data().registration;
          this.trailer.controller = user.name;
          this.trailer.date = moment(new Date().toISOString()).locale('en').format('DD/MM/YYYY');
          this.trailer.timeIn = moment(new Date().toISOString()).locale('en').format('HH:mm');
          this.trailer.key = UUID.UUID();
          this.afs.collection('inspections').doc(this.trailer.key).set(this.trailer);
        });
      }
    });
  }

  drawStart() {
    this.isDrawing = true;
  }

  drawComplete() {
    this.isDrawing = false;
    if (this.type === 'trucks') {
      this.truck.controllerSig = this.sigPad.toDataURL();
    } else {
      this.trailer.controllerSig = this.sigPad.toDataURL();
    }
  }

  clearPad() {
    this.sigPad.clear();
    if (this.type === 'trucks') {
      this.truck.controllerSig = '';
    } else {
      this.trailer.controllerSig = '';
    }
  }

  update() {
    if (this.type === 'trucks') {
      this.truck.progress = 0;
      if (this.truck.jobNo !== '') {
        this.truck.progress = this.truck.progress + 1;
      }
      if (this.truck.traps !== '') {
        this.truck.progress = this.truck.progress + 1;
      }
      if (this.truck.netts !== '') {
        this.truck.progress = this.truck.progress + 1;
      }
      if (this.truck.belts !== '') {
        this.truck.progress = this.truck.progress + 1;
      }
      if (this.truck.chains !== '') {
        this.truck.progress = this.truck.progress + 1;
      }
      if (this.truck.satans !== '') {
        this.truck.progress = this.truck.progress + 1;
      }
      if (this.truck.locks !== '') {
        this.truck.progress = this.truck.progress + 1;
      }
      if (this.truck.uprights !== '') {
        this.truck.progress = this.truck.progress + 1;
      }
      if (this.truck.plate !== '') {
        this.truck.progress = this.truck.progress + 1;
      }
      this.truck.progress = this.truck.progress / 9;
      this.afs.collection('inspections').doc(this.truck.key).update(this.truck);
      if (this.truck.progress === 0) {
        var status = 'In Queue';
      } else if (this.truck.progress > 0 && this.truck.progress < 1) {
        var status = 'In Progress';
      } else if (this.truck.progress === 1) {
        var status = 'Completed';
      }
      this.afs.collection('trucks').doc(this.truck.truckReg).update({
        equipmentStatus: status,
        equipmentProgress: this.truck.progress,
        timeStamp: moment(new Date().toISOString()).locale('en').format('DD/MM/YYYY, HH:mm'),
      });
    } else {
      this.trailer.progress = 0;
      if (this.trailer.jobNo !== '') {
        this.trailer.progress = this.trailer.progress + 1;
      }
      if (this.trailer.traps !== '') {
        this.trailer.progress = this.trailer.progress + 1;
      }
      if (this.trailer.netts !== '') {
        this.trailer.progress = this.trailer.progress + 1;
      }
      if (this.trailer.belts !== '') {
        this.trailer.progress = this.trailer.progress + 1;
      }
      if (this.trailer.chains !== '') {
        this.trailer.progress = this.trailer.progress + 1;
      }
      if (this.trailer.satans !== '') {
        this.trailer.progress = this.trailer.progress + 1;
      }
      if (this.trailer.locks !== '') {
        this.trailer.progress = this.trailer.progress + 1;
      }
      if (this.trailer.uprights !== '') {
        this.trailer.progress = this.trailer.progress + 1;
      }
      if (this.trailer.plate !== '') {
        this.trailer.progress = this.trailer.progress + 1;
      }
      this.trailer.progress = this.trailer.progress / 9;
      this.afs.collection('inspections').doc(this.trailer.key).update(this.trailer);
      if (this.trailer.progress === 0) {
        var status = 'In Queue';
      } else if (this.trailer.progress > 0 && this.trailer.progress < 1) {
        var status = 'In Progress';
      } else if (this.trailer.progress === 1) {
        var status = 'Completed';
      }
      this.afs.collection('trailers').doc(this.trailer.trailerReg).update({
        equipmentStatus: status,
        equipmentProgress: this.trailer.progress,
        timeStamp: moment(new Date().toISOString()).locale('en').format('DD/MM/YYYY, HH:mm'),
      });
    }
  }

  save() {
    if (this.type === 'trucks') {
      this.check1().then(() => {
        this.loading.present('Saving, Please wait...').then(() => {
          this.truck.timeOut = moment(new Date().toISOString()).locale('en').format('HH:mm');
          this.truck.duration = moment(this.truck.timeOut, 'HH:mm').diff(moment(this.truck.timeIn, 'HH:mm'), 'minutes', true);

          // Save inspection
          this.afs.collection('inspections').doc(this.truck.key).update(this.truck);
          this.router.navigate(['home']);
          this.loading.dismiss();
        });
      });
    } else {
      this.check2().then(() => {
        this.loading.present('Saving, Please wait...').then(() => {
          this.trailer.timeOut = moment(new Date().toISOString()).locale('en').format('HH:mm');
          this.trailer.duration = moment(this.trailer.timeOut, 'HH:mm').diff(moment(this.trailer.timeIn, 'HH:mm'), 'minutes', true);

          // Save inspection
          this.afs.collection('inspections').doc(this.trailer.key).update(this.trailer);
          this.router.navigate(['home']);
          this.loading.dismiss();
        });
      });
    }
  }

  check1() {
    return new Promise<void>((resolve, reject) => {
      if (this.truck.jobNo !== '') {
        if (this.truck.controllerSig !== '') {
          resolve();
        } else {
          this.alertMsg('Signature')
        }
      } else {
        this.alertMsg('Job Card Number')
      }
    });
  }

  check2() {
    return new Promise<void>((resolve, reject) => {
      if (this.trailer.jobNo !== '') {
        if (this.trailer.controllerSig !== '') {
          resolve();
        } else {
          this.alertMsg('Signature')
        }
      } else {
        this.alertMsg('Job Card Number')
      }
    });
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
}
