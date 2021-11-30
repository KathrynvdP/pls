import { Component, OnInit, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { LoadingService } from '../services/loading.service';
import { Router } from '@angular/router';
import moment from 'moment';
import { UUID } from 'angular2-uuid';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-trip-sheet',
  templateUrl: './trip-sheet.page.html',
  styleUrls: ['./trip-sheet.page.scss'],
})
export class TripSheetPage implements OnInit {

  trip = {
    key: '', dateStart: '', dateEnd: '', timeStart: '', timeEnd: '', duration: {}, driver: '', driverKey: '', code: '', fleet: '', fleetNo: '', locStart: '', locEnd: '',
    latStart: 0, lngStart: 0, latEnd: 0, lngEnd: 0, kmStart: 0, kmEnd: 0, kmTotal: 0,
  };

  start = false;

  trucks = [];
  truck;

  @ViewChild('placesRef', { static: false }) placesRef: GooglePlaceDirective;

  constructor(private storage: Storage, private afs: AngularFirestore, public loading: LoadingService, public router: Router,
    public alertCtrl: AlertController) { }

  ngOnInit() {
    this.storage.get('trip').then(trip => {
      if (trip) {
        this.start = false;
        this.trip = trip;
        this.trip.timeEnd = moment(new Date().toISOString()).locale('en').format('HH:mm');
        this.trip.dateEnd = moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD');
        console.log('Continue Trip');
        this.getTrucks();
      } else {
        console.log('Starting Trip');
        this.start = true;
        this.trip.key = UUID.UUID();
        this.trip.dateStart = moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD');
        this.trip.timeStart = moment(new Date().toISOString()).locale('en').format('HH:mm');
        this.getTrucks();
        console.log(this.trucks)
        this.storage.get('user').then(user => {
          this.trip.driver = user.name;
          this.trip.driverKey = user.key;
          this.trip.code = user.code;
          this.trip.fleet = user.fleet;
          this.trip.fleetNo = user.fleetNo;
        });
      }
    });
  }

  getTrucks() {
    this.afs.collection('trucks').ref.orderBy('fleetNo').get().then(trucks => {
      trucks.forEach((truck: any) => {
        this.trucks.push({ registration: truck.data().registration, fleet: truck.data().fleet, fleetNo: truck.data().fleetNo });
      });
    });
  }

  changeTruck(truck) {
    this.trip.code = truck.registration;
    this.trip.fleet = truck.fleet;
    this.trip.fleetNo = truck.fleetNo;
    console.log(this.trip.fleetNo);
    this.updateDriver();
  }
  updateDriver() {
    this.afs.collection('users').doc(this.trip.driverKey).update({
      code: this.trip.code,
      fleet: this.trip.fleet,
      fleetNo: this.trip.fleetNo
    })
    this.afs.collection('trucks').doc(this.trip.code).update({ driver: this.trip.driver });
    var log = {
      key: UUID.UUID(),
      date: this.trip.dateStart,
      time: this.trip.timeStart,
      type: 'Driver Change',
      vehicle: this.trip.code,
      // prevDriver: this.prevDriver,
      newDriver: this.trip.driver
    };
    this.afs.collection('logs').doc(log.key).set(log);
    this.afs.collection('users').ref.doc(this.trip.driverKey).get().then(user => {
      var data = user.data();
      if (data) {
        this.storage.set('user', data)
      }
    })
  }


  public handleAddressChange1(address: Address) {
    var add = address.formatted_address;
    this.trip.locStart = add;
    this.trip.latStart = address.geometry.location.lat();
    this.trip.lngStart = address.geometry.location.lng();
  }

  public handleAddressChange2(address: Address) {
    var add = address.formatted_address;
    this.trip.locEnd = add;
    this.trip.latEnd = address.geometry.location.lat();
    this.trip.lngEnd = address.geometry.location.lng();
  }

  save() {
    this.loading.present('Saving, Please Wait...').then(() => {
      if (this.start === true) {
        // Save to Storage to be completed later
        this.storage.set('trip', this.trip);
        this.router.navigate(['home']);
      } else {
        // if trip is complete, remove from Storage and save in DB
        this.trip.kmTotal = this.trip.kmEnd - this.trip.kmStart;
        this.trip.timeEnd = moment(new Date().toISOString()).locale('en').format('HH:mm');
        this.trip.duration = moment(this.trip.timeEnd, 'HH:mm').diff(moment(this.trip.timeStart, 'HH:mm'), 'minutes', true);
        this.afs.collection('trip-sheets').doc(this.trip.key).set(this.trip);
        this.storage.remove('trip');
        this.router.navigate(['home']);
      }
      this.loading.dismiss();
    });
  }

  check1() {
    if (this.trip.kmStart !== 0) {
      if (this.trip.locStart !== '') {
        this.save();
      } else {
        this.alertMsg('Start Location');
      }
    } else {
      this.alertMsg('Start Mileage');
    }
  }

  check2() {
    if (this.trip.kmEnd !== 0) {
      if (this.trip.locEnd !== '') {
        this.save();
      } else {
        this.alertMsg('End Location');
      }
    } else {
      this.alertMsg('End Mileage');
    }
  }

  async alertMsg(item) {
    let prompt = await this.alertCtrl.create({
      header: 'Invalid Form',
      message: `This trip is missing the following field: ${item}`,
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
