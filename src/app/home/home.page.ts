import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AuthenticationService } from '../services/authentication.service';
import { EditAccountPage } from '../edit-account/edit-account.page';
import { ModalController } from '@ionic/angular';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  userType;

  tripExist = false;

  user = {
    key: '',
    name: '',
    type: ''
  };

  count = 0;

  truckCount = 0;
  operator = false;
  fleet;
  trucks = [];
  truckCollection: AngularFirestoreCollection<any>;
  truckObj;

  constructor(public router: Router, private storage: Storage, 
    private auth: AuthenticationService, public modalCtrl: ModalController, 
    private afs: AngularFirestore,
    private fcm: FirebaseX) { }

  ngOnInit() {
    this.storage.get('user').then(user => {
      this.user = user;
      this.userType = user.type;
      console.log(this.userType)
      if (this.userType === 'Driver') {
        this.storage.get('trip').then(trip => {
          if (trip) {
            this.tripExist = true;
          } else {
            this.tripExist = false;
          }
        });
      }
      this.getToken();
    });
  }

  ionViewWillEnter() {
    this.storage.get('user').then(user => {
      this.user = user;
      this.userType = user.type;
      // console.log(this.userType)
      if (this.userType === 'Driver') {
        this.storage.get('trip').then(trip => {
          if (trip) {
            this.tripExist = true;
          } else {
            this.tripExist = false;
          }
        });
      } else if (this.userType === 'Foreman') {
        this.count = 0;
        this.afs.collection('trucks').ref.where('deviations', '==', true).get().then(trucks => {
          trucks.forEach(truck => {
            this.count = this.count + 1
          })
        })
      } else if (this.userType.startsWith('Operator:')) {
        this.operator = true;
        var length = this.userType.length;
        this.fleet = this.userType.slice(10, length)
        console.log(this.fleet)
        // console.log('Fleet: ' + this.fleet)
        this.trucks = [];
        this.truckCount = 0;

        this.truckCollection = this.afs.collection('trucks', ref => ref.where('fleet', '==', this.fleet).where('authenticated', '==', 'Awaiting'));
        this.truckObj = this.truckCollection.valueChanges()
          .subscribe(vehicles => {
            this.trucks = [];
            this.truckCount = 0;
            vehicles.forEach(truck => {
            if (truck.timeStamp !== '' && truck.timeStamp !== undefined) {
              this.truckCount = this.truckCount + 1
              this.trucks.push(truck);
            }
          })
        })
      }
    });
  }

  getToken() {
    this.storage.get('user').then(user => {
      this.fcm.getToken().then(token => {
        console.log('Token: ' + token)
        this.afs.collection('tokens').doc(user.key).set({ token: token, key: user.key });
      });
      /*
      // Recieve Notifications
      this.fcm.onNotification().subscribe(data => {
        if (data.wasTapped) {
          console.log('Received Notification in background');
        } else {
          console.log('Received Notification in foreground');
        }
      });
      */
    });
  }

  securityIn() {
    this.router.navigate([`checkin`]);
  }

  securityOut() {
    this.router.navigate([`checkout`]);
  }

  reqAuth() {
    this.router.navigate([`request-auth`]);
  }

  wash() {
    this.router.navigate([`washbay-inspection`]);
  }

  work() {
    this.router.navigate([`workshop-inspection`]);
  }

  tyre() {
    this.router.navigate([`tyrebay-inspection`]);
  }

  diesel() {
    this.router.navigate([`dieselbay-scan`]);
  }

  dev() {
    this.router.navigate([`deviations`]);
  }

  trip() {
    this.router.navigate([`trip-sheet`]);
  }

  fuel() {
    this.router.navigate([`fuel-record`]);
  }

  order() {
    this.router.navigate([`start-order`]);
  }

  authorise(truck) {
    console.log(truck.code)
    this.router.navigate(['authorise', { code: truck.code }])
  }

  logout() {
    this.router.navigate(['login']).then(() => {
      this.auth.logout().then(() => {
        this.storage.remove('user');
      });
    });
  }

  async edit() {
    console.log(this.user.key)
    const modal = await this.modalCtrl.create({
      component: EditAccountPage,
      componentProps: { key: this.user.key }
    });
    return await modal.present();
  }

}
