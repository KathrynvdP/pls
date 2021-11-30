import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import moment from 'moment';
declare var google;

@Component({
  selector: 'app-start-order',
  templateUrl: './start-order.page.html',
  styleUrls: ['./start-order.page.scss'],
})
export class StartOrderPage implements OnInit {

  driver: any = {}
  notes = [];
  loadNum;
  assDriver;
  status;
  correctFleet;
  trucks = [];
  truck;

  correctOrder;
  orderAvail = false;

  inOrder = false;

  constructor(private storage: Storage, private afs: AngularFirestore, private navCtrl: NavController, private router: Router) { }

  ngOnInit() {
    this.storage.get('inOrder').then(order => {
      if (order) {
        this.inOrder = true;
      } else {
        this.storage.get('user').then(user => {
          this.driver = user;
          this.afs.collection('delivery-notes').ref.where('fleetNo', '==', this.driver.fleetNo).get().then(notes => {
            notes.forEach(note => {
              this.notes.push(note.data());
            })
            if (this.notes.length === 0) {
              this.orderAvail = false;
            } else {
              this.orderAvail = true;
              this.loadNum = this.notes[0].loadNum;
              this.assDriver = this.notes[0].driver;
              this.status = this.notes[0].status;
            }
          })
        })
      }
    })
  }

  fleet(string) {
    // console.log(string)
    if (string === 'No') {
      this.correctFleet = false;
      this.afs.collection('trucks').ref.orderBy('fleetNo').get().then(trucks => {
        trucks.forEach(truck => {
          this.trucks.push(truck.data());
        })
      })
    } else {
      this.correctFleet = true;
    }
  }

  newFleet(truck) {
    // console.log(truck)
    this.afs.collection('users').doc(this.driver.key).update({ fleet: truck.fleet, fleetNo: truck.fleetNo });
    this.afs.collection('trucks').doc(truck.code).update({ driver: this.driver.name })
    this.afs.collection(`delivery-notes`).ref.where('fleetNo', '==', truck.fleetNo).get().then(order => {
      order.forEach(order => {
        this.notes.push(order.data())
      })
      this.loadNum = this.notes[0].loadNum
      this.assDriver = this.notes[0].driver;
      this.status = this.notes[0].status;
      this.driver.fleet = truck.fleet;
      this.driver.fleetNo = truck.fleetNo;
      this.storage.set('user', this.driver);
      this.correctFleet = true;
    })
  }

  orderQ(string) {
    if (string === 'No') {
      this.correctOrder = false;
    } else {
      this.correctOrder = true;
    }
  }

  start() {
    this.notes.forEach(note => {
      this.afs.collection(`delivery-notes`).doc(note.key).update({
        startDate: moment(new Date()).format('YYYY/MM/DD HH:mm'),
        driver: this.driver.name,
        driverKey: this.driver.key,
        status: 'On Route'
      });
    })
    this.storage.set('notes', this.notes);
    this.storage.set('inOrder', true);
    this.router.navigate(['order-tracking'])
  }

  back() {
    this.navCtrl.back();
  }

  resume() {
    this.router.navigate(['order-tracking'])
  }

}
