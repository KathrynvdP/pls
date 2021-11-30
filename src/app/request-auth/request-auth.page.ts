import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { UUID } from 'angular2-uuid';
import { LoadingService } from '../services/loading.service';
import moment from 'moment';

@Component({
  selector: 'app-request-auth',
  templateUrl: './request-auth.page.html',
  styleUrls: ['./request-auth.page.scss'],
})
export class RequestAuthPage {

  truck;

  option;

  trucks = [];

  constructor(private storage: Storage, private afs: AngularFirestore, public loading: LoadingService, public router: Router) { }

  ionViewDidEnter() {
    this.loading.present('Loading, Please Wait').then(() => {
      this.afs.collection('trucks').ref.get().then(trucks => {
        trucks.forEach(truck => {
          this.trucks.push(truck.data())
        })
        this.loading.dismiss();
      })
    })
  }

  reqAuth() {
    console.log(this.option)
    this.loading.present('Sending, Please Wait...').then(() => {
      this.truck = this.option.registration
      this.storage.get('user').then(user => {
        var user = user.name
        this.afs.collection('trucks').doc(this.truck).update({ authenticated: 'Awaiting', authUser: user, authTime: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD, HH:mm') })
        var info = {
          key: UUID.UUID(),
          status: 'Open',
          code: this.option.code,
          fleet: this.option.fleet,
          fleetNo: this.option.fleetNo,
          date: moment(new Date().toISOString()).locale('en').format('DD/MM/YYYY'),
          time: moment(new Date().toISOString()).locale('en').format('HH:mm:ss'),
          from: 'Request Auth from Sec out'
        };
        this.afs.collection('requests').doc(info.key).set(info)
        this.router.navigate(['home'])
        this.loading.dismiss();
      })
    })
  }

}
