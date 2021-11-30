import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-deviations',
  templateUrl: './deviations.page.html',
  styleUrls: ['./deviations.page.scss'],
})
export class DeviationsPage implements OnInit {

  trucks = [];
  truck;

  washbay: any = {};
  washDevs = [];
  wash = false;
  washDev = false
  tyrebay: any = {};
  tyreDevs = [];
  tyre = false;
  tyreDev = false;
  workshop: any = {};
  workDevs = [];
  work = false;
  workDev = false;
  correction = '';

  gotTruck = false;

  constructor(private afs: AngularFirestore, private storage: Storage, public loading: LoadingService, public router: Router) { }

  ngOnInit() {
    this.gotTruck = false;
    this.afs.collection('trucks').ref.where('deviations', '==', true).orderBy('fleetNo').get().then(trucks => {
      trucks.forEach(truck => {
        this.trucks.push(truck.data());
      })
    })
  }

  getDevs(truck) {
    console.log(truck.jobNo)
    this.afs.collection('inspections').ref.where('code', '==', truck.code).where('jobNo', '==', truck.jobNo).get().then(inspecs => {
      inspecs.forEach((inspec: any) => {
        if (inspec.data().type === 'washbay') {
          this.wash = true;
          this.washbay = inspec.data();
          if (this.washbay.deviations) {
            if (this.washbay.deviations.length > 0) {
              this.washDev = true;
              this.washbay.deviations.forEach(dev => {
                if (dev.actioned) {
                  this.washDevs.push({ item: dev.item, note: dev.note, photo: dev.photo, correction: dev.correction, actioned: dev.actioned })
                } else {
                  this.washDevs.push({ item: dev.item, note: dev.note, photo: dev.photo, correction: dev.correction, actioned: false })
                }
              });
            }
          }
        } else if (inspec.data().type === 'tyrebay') {
          this.tyre = true;
          this.tyrebay = inspec.data();
          if (this.tyrebay.deviations.length > 0) {
            this.tyreDev = true;
            this.tyrebay.deviations.forEach(dev => {
              if (dev.actioned) {
                this.tyreDevs.push({ item: dev.item, note: dev.note, photo: dev.photo, correction: dev.correction, actioned: dev.actioned })
              } else {
                this.tyreDevs.push({ item: dev.item, note: dev.note, photo: dev.photo, correction: dev.correction, actioned: false })
              }
            });
          }
        } else if (inspec.data().type === 'workshop') {
          this.work = true;
          this.workshop = inspec.data();
          if (this.workshop.deviations.length > 0) {
            this.workDev = true;
            this.workshop.deviations.forEach(dev => {
              if (dev.actioned) {
                this.workDevs.push({ item: dev.item, note: dev.note, photo: dev.photo, correction: dev.correction, actioned: dev.actioned })
              } else {
                this.workDevs.push({ item: dev.item, note: dev.note, photo: dev.photo, correction: dev.correction, actioned: false })
              }
            });
          }
        }
      })
      this.gotTruck = true
    })
  }

  save() {
    this.loading.present('Saving, Please Wait...').then(() => {
      if (this.washDev === true) {
        this.afs.collection('inspections').doc(this.washbay.key).update({ deviations: this.washDevs })
      } else if (this.tyreDev === true) {
        this.afs.collection('inspections').doc(this.tyrebay.key).update({ deviations: this.tyreDevs })
      } else if (this.workDev === true) {
        this.afs.collection('inspections').doc(this.workshop.key).update({ deviations: this.workDevs })
      }
      this.router.navigate(['home'])
      this.loading.dismiss();
    })
  }

}
