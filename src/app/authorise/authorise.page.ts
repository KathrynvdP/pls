import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { LoadingService } from '../services/loading.service';
import { GiveAuthPage } from '../give-auth/give-auth.page';

@Component({
  selector: 'app-authorise',
  templateUrl: './authorise.page.html',
  styleUrls: ['./authorise.page.scss'],
})
export class AuthorisePage implements OnInit {

  code;

  washCheck = false;
  tyreCheck = false;
  checkinCheck = false;
  checkoutCheck = false;
  workCheck = false;
  dieselCheck = false;

  washbay: any = {};
  tyrebay: any = {};
  checkin: any = {};
  checkout: any = {};
  workshop: any = {};
  diesel: any = {};
  deviations = [];
  truck: any = {};

  washComp = true;
  washDev = false;
  workDev = false;
  tyreDev = false;

  override = false;

  constructor(private storage: Storage, private afs: AngularFirestore, public activatedRoute: ActivatedRoute, public loading: LoadingService, public navCtrl: NavController, public alertCtrl: AlertController, public modalCtrl: ModalController) { }

  ngOnInit() {
    this.loading.present('Loading, Please Wait...').then(() => {
      this.code = this.activatedRoute.snapshot.paramMap.get('code');
      console.log(this.code)
      this.afs.collection('trucks').doc(this.code).ref.get().then(truck => {
        var data = truck.data();
        if (data) {
          this.truck = data
        }
        this.getInspecs();
      })
      setTimeout(() => {
        this.loading.dismiss();
      }, 1200);
    })
  }

  getInspecs() {
    this.afs.collection('inspections').ref.where('code', '==', this.code).where('jobNo', '==', this.truck.jobNo).limit(10).get().then(inspecs => {
      inspecs.forEach((inspec: any) => {
        if (inspec.data().type === 'washbay') {
          this.washCheck = true;
          this.washbay = inspec.data();
          if (this.washbay.complete === true) {
            this.washComp = true
          } else if (this.washbay.complete === false) {
            this.washComp = false;
          }
          if (this.washbay.deviations) {
            if (this.washbay.deviations.length > 0) {
              this.washDev = true;
              this.washbay.deviations.forEach(dev => {
                this.deviations.push({ note: dev.note, photo: dev.photo })
              });
            }
          }
        } else if (inspec.data().type === 'tyrebay') {
          this.tyreCheck = true
          this.tyrebay = inspec.data();
          if (this.tyrebay.deviations) {
            if (this.tyrebay.deviations.length > 0) {
              this.tyreDev = true;
              this.tyrebay.deviations.forEach(dev => {
                this.deviations.push({ note: dev.note, photo: dev.photo })
              });
            }
          }
        } else if (inspec.data().type === 'workshop') {
          this.workCheck = true;
          this.workshop = inspec.data();
          console.log(this.workshop.code)
          if (this.workshop.deviations) {
            if (this.workshop.deviations.length > 0) {
              this.workDev = true;
              this.workshop.deviations.forEach(dev => {
                this.deviations.push({ note: dev.note, photo: dev.photo })
              });
            }
          }
        } else if (inspec.data().type === 'checkin') {
          this.checkinCheck = true;
        } else if (inspec.data().type === 'checkout') {
          this.checkout = inspec.data();
        } else if (inspec.data().type === 'dieselbay') {
          this.dieselCheck = true;
        }
      })
    })
  }

  close() {
    this.navCtrl.navigateBack('home');
  }

  check() {
    if (this.truck.authenticated !== 'Authorised') {
      this.checkDevs();
    } else {
      this.alert();
    }
  }

  checkDevs() {
    var devs = '';
    if (this.checkinCheck !== true) {
      devs = `<p>CheckIn Incomplete</p>`
    }
    if (this.washCheck !== true) {
      devs = devs + `<p>Washbay Incomplete</p>`
    }
    if (this.tyreCheck !== true) {
      devs = devs + `<p>Tyrebay Incomplete</p>`
    }
    if (this.workCheck !== true) {
      devs = devs + `<p>Workshop Incomplete</p>`
    }
    if (this.dieselCheck !== true) {
      devs = devs + `<p>Diesel Bay Incomplete</p>`
    }
    if (this.washComp !== true) {
      devs = devs + `<p>Wash Bay Bypassed</p>`
    }
    if (this.washbay.deviations && this.washbay.deviations !== undefined && this.washbay.deviations.length !== 0) {
      devs = devs + `<p>Washbay Deviations Found</p>`
    }
    if (this.workshop.deviations && this.workshop.deviations !== undefined && this.workshop.deviations.length !== 0) {
      devs = devs + `<p>Workshop Deviations Found</p>`
    }
    if (this.tyrebay.deviations && this.tyrebay.deviations !== undefined && this.tyrebay.deviations.length !== 0) {
      devs = devs + `<p>Tyrebay Deviations Found</p>`
    }
    if (devs === '') {
      devs = 'None! Way To Go!'
      this.override = false;
    } else {
      this.override = true;
    }
    this.overAlert(devs)
  }

  async overAlert(devs) {
    if (this.override === false) {
      let prompt = await this.alertCtrl.create({
        header: 'Issues Found:',
        message: `${devs}`,
        cssClass: 'alert',
        buttons: [
          {
            text: 'Back',
            handler: data => {
            }
          },
          {
            text: 'AUTHORISE',
            handler: data => {
              this.auth(false)
            }
          },
        ]
      });
      return await prompt.present();
    } else {
      let prompt = await this.alertCtrl.create({
        header: 'Issues Found:',
        message: `${devs}`,
        cssClass: 'alert',
        buttons: [
          {
            text: 'Back',
            handler: data => {
            }
          },
          {
            text: 'OVERRIDE',
            handler: data => {
              this.auth(true)
            }
          },
        ]
      });
      return await prompt.present();
    }
  }

  async auth(item) {
    //console.log(this.truck.code)
    const modal = await this.modalCtrl.create({
      component: GiveAuthPage,
      componentProps: { key: this.truck.code, override: item, deviations: this.deviations }
    });
    return await modal.present();
  }

  async alert() {
    let prompt = await this.alertCtrl.create({
      header: 'Invalid Request',
      message: `This vehicle has already been authorised`,
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

