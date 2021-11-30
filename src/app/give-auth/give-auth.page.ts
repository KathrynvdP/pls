import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AlertController, ModalController, NavParams } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { LoadingService } from '../services/loading.service';
import moment from 'moment';
import { UUID } from 'angular2-uuid';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';

@Component({
  selector: 'app-give-auth',
  templateUrl: './give-auth.page.html',
  styleUrls: ['./give-auth.page.scss'],
})
export class GiveAuthPage implements OnInit {

  params;

  key;
  override;
  deviations;

  reason = '';
  operator;
  sig = '';
  note = '';
  name;
  userKey;

  truck: any = {};
  doc: any = {};

  isDrawing = true;

  signaturePadOptions: Object = {
    minWidth: 2,
    backgroundColor: '#fff',
    penColor: '#000',
    canvasWidth: 250
  };

  @ViewChild('sigpad', { static: false }) sigPad: SignaturePad;

  constructor(public navParams: NavParams, private afs: AngularFirestore, public router: Router, public loading: LoadingService, private storage: Storage, public modalCtrl: ModalController, public alertCtrl: AlertController) {
    this.params = navParams.data;
  }

  ngOnInit() {
    this.storage.get('user').then(user => {
      this.key = this.params.key
      this.override = this.params.override
      this.deviations = this.params.deviations
      this.name = user.name;
      this.userKey = user.key;
      console.log(this.deviations)
      this.afs.collection('trucks').doc(this.key).ref.get().then(truck => {
        var data = truck.data()
        if (data) {
          this.truck = data;
        }
      })
    })
  }

  drawStart() {
    this.isDrawing = true;
  }

  drawComplete() {
    this.isDrawing = false;
    this.sig = this.sigPad.toDataURL();
  }

  clearPad() {
    this.sigPad.clear();
    this.sig = '';
  }

  auth() {
    if (this.override === false) {
      this.check().then(() => {
        this.loading.present('Authorising, Please Wait...').then(() => {
          this.doc = {
            key: UUID.UUID(),
            time: moment(new Date().toISOString()).locale('en').format('HH:mm'),
            date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
            code: this.truck.code,
            registration: this.truck.registration,
            fleetNo: this.truck.fleetNo,
            fleet: this.truck.fleet,
            operator: this.name,
            operatorKey: this.userKey,
            operatorSig: this.sig,
            deviations: this.deviations,
            override: false,
            notes: this.note,
            reason: '',
            jobNo: this.truck.jobNo,
            actioned: false,
            timeStamp: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD HH:mm'),
          }
          this.afs.collection('authentications').doc(this.doc.key).set(this.doc).then(() => {
            this.afs.collection('trucks').doc(this.key).update({ authenticated: 'Authorised', operator: this.name, override: false, deviations: false })
            this.router.navigate(['home'])
            this.modalCtrl.dismiss();
            this.loading.dismiss();
          })
        })
      })
    } else {
      this.overCheck().then(() => {
        this.loading.present('Overriding, Please Wait...').then(() => {
          this.doc = {
            key: UUID.UUID(),
            time: moment(new Date().toISOString()).locale('en').format('HH:mm'),
            date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
            code: this.truck.code,
            registration: this.truck.registration,
            fleetNo: this.truck.fleetNo,
            fleet: this.truck.fleet,
            operator: this.name,
            operatorKey: this.userKey,
            operatorSig: this.sig,
            deviations: this.deviations,
            override: true,
            reason: this.reason,
            notes: this.note,
            jobNo: this.truck.jobNo,
            actioned: false,
            timeStamp: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD HH:mm'),
          }
          this.afs.collection('authentications').doc(this.doc.key).set(this.doc).then(() => {
            this.afs.collection('trucks').doc(this.key).update({ authenticated: 'Authorised', operator: this.name, override: true, deviations: false })
            this.router.navigate(['home'])
            this.modalCtrl.dismiss();
            this.loading.dismiss();
          });
        });
      });
    }
  }

  check() {
    return new Promise<void>((resolve, reject) => {
      if (this.sig !== '') {
        resolve();
      } else {
        this.alertMsg('Signature')
      }
    })
  }

  overCheck() {
    return new Promise<void>((resolve, reject) => {
      if (this.reason !== '') {
        if (this.sig !== '') {
          resolve();
        } else {
          this.alertMsg('Signature')
        }
      } else {
        this.alertMsg('Reason')
      }
    })
  }

  async alertMsg(item) {
    const prompt = await this.alertCtrl.create({
      header: 'Incomplete Form',
      message: `Please complete the following before saving: ${item}`,
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

  back() {
    this.modalCtrl.dismiss();
  }

}

