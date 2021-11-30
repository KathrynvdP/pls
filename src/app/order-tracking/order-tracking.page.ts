import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AlertController, LoadingController, PopoverController, ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { LoadingService } from '../services/loading.service';
import { ToastService } from '../services/toast.service';
import moment from 'moment';
import { PopoverComponent } from '../popover/popover.component';
import { ConnectionService } from '../services/connection.service';
import { SigniturePageComponent } from '../signiture-page/signiture-page.component';
import { EventService } from '../services/event.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
declare var google;

@Component({
  selector: 'app-order-tracking',
  templateUrl: './order-tracking.page.html',
  styleUrls: ['./order-tracking.page.scss'],
})
export class OrderTrackingPage implements OnInit {

  notes;
  loadNum;
  estTime;
  estDist;
  markers = [];

  currentPos = {
    lat: 0, lng: 0,
  }

  completed = false;

  locationWatchStarted: boolean;
  locationSubscription: any;
  completedNotesKeys: any = [];

  truckCode;

  private orderDoc: AngularFirestoreDocument<any>;
  orderObs: Observable<any>;

  @ViewChild('imageChooser', { static: false }) filePickerRef: ElementRef<HTMLInputElement>;
  downloadURL: Observable<string | null>;

  labelOptions = {
    color: 'white',
    fontFamily: '',
    fontSize: '14px',
    fontWeight: 'bold',
    text: "some text"
  }
  load = false;

  loadMsg;

  constructor(public modalController: ModalController,
    private afs: AngularFirestore,
    private storage: Storage,
    private alertCtrl: AlertController,
    private loading: LoadingService,
    private toast: ToastService,
    private router: Router,
    private loadingCtrl: LoadingController,
    public geolocation: Geolocation,
    private popCtlr: PopoverController,
    private connection: ConnectionService,
    private eventService: EventService) { }

  async ngOnInit() {
    await this.loading.present('Loading Order, Please Wait...')
    this.load = true;
    this.storage.get('notes').then(async notes => {
      this.notes = notes;
      this.truckCode = this.notes[0].code;
      this.loadNum = this.notes[0].loadNum;
      this.openOrderSub();
      this.subToNoteCompletion();
    })
  }

  openOrderSub() {
    this.notes.forEach(note => {
      this.orderDoc = this.afs.doc<any>(`delivery-notes/${note.key}`);
      this.orderObs = this.orderDoc.valueChanges();
      this.orderObs.subscribe(doc => {
        var data = doc;
        if (data) {
          note.estTime = data.estTime;
          note.estDist = data.estDist;
          var currentUpdate = moment(data.currentUpdate).format('HH:mm')
          var timethen = moment(currentUpdate, 'HH:mm').add(data.eta, 'minutes').format('HH:mm A')
          note.eta = timethen;
          this.currentPos.lat = data.currentPos.lat;
          this.currentPos.lng = data.currentPos.lng;
          this.setMarkers();
        }
      })
    });
  }

  setMarkers() {
    this.markers = [];
    this.markers.push({
      lat: this.currentPos.lat, lng: this.currentPos.lng, title: 'Current Location', address: `ETA: ${this.notes[0].estTime}`,
      iconUrl: {
        url: './assets/imgs/main.png',
        scaledSize: {
          width: 40,
          height: 40
        },
        labelOrigin: new google.maps.Point(19, -10)
      },
    })
    this.markers.push({
      lat: this.notes[0].startPos.lat * 1, lng: this.notes[0].startPos.lng * 1, title: 'Start Location', address: `${this.notes[0].startPos.name}:\n ${this.notes[0].startPos.address}`,
      iconUrl: {
        url: './assets/imgs/start.png',
        scaledSize: {
          width: 40,
          height: 40
        },
        labelOrigin: new google.maps.Point(19, -10)
      }
    })
    this.notes.forEach(note => {
      this.markers.push({
        lat: note.endPos.lat * 1, lng: note.endPos.lng * 1, title: 'End Location', address: `${note.endPos.name}:\n ${note.endPos.address}`,
        iconUrl: {
          url: './assets/imgs/end.png',
          scaledSize: {
            width: 40,
            height: 40
          },
          labelOrigin: new google.maps.Point(19, -10)
        }
      })
    })
    if (this.load === true) {
      this.loading.dismiss();
      this.load = false;
    }
  }

  async markerClicked(mark) {
    const prompt = await this.alertCtrl.create({
      header: `${mark.title}:`,
      message: `${mark.address}`,
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

  complete() {
    this.completed = true;
  }

  onMapReady(map) {
    console.log(map)
    setTimeout(() => {
      map.setOptions({
        zoomControl: 'true',
        zoomControlOptions: {
          position: google.maps.ControlPosition.RIGHT_CENTER,
          style: google.maps.ZoomControlStyle.DEFAULT
        }
      });
    }, 2000)
  }

  async uploadOptions(ev: any) {
    const popover = await this.popCtlr.create({
      component: PopoverComponent,
      componentProps: { notes: this.notes },
      cssClass: 'my-custom-class',
      mode: 'ios',
      event: ev,
      translucent: false,
    });
    popover.onDidDismiss().then(res => {
      var newNote = res.data
      if (res.data !== undefined) {
        var foundIndex = this.notes.findIndex(x => x.key == newNote.key);
        this.notes[foundIndex] = newNote;
      }
    })
    return await popover.present();
  }

  async missingPOD(note) {
    const prompt = await this.alertCtrl.create({
      header: `Incomplete Order`,
      message: `Please upload the POD for ${note.delNote}`,
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

  completeOrder(note) {
    this.presentSignitureModal(note);
  }

  async subToNoteCompletion() {
    this.eventService.noteComplete.subscribe((res: any) => {
      if (this.completedNotesKeys.indexOf(res.id) === -1) {
        this.completedNotesKeys.push(res.id);
        this.notes.filter(s => s.key == res.id)[0]['pod'] = res.pod;
        console.log('doneeee....');
        console.log(this.notes);
      }

    })
  }

  async presentSignitureModal(note: any) {
    const modal = await this.modalController.create({
      component: SigniturePageComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        note: note
      }
    });
    modal.onDidDismiss().then(res => {
      var newNote = res.data
      if (res.data !== undefined) {
        console.log(newNote.delNote)
        var foundIndex = this.notes.findIndex(x => x.key == newNote.key);
        this.notes.splice(foundIndex, 1)
        this.storage.set('notes', this.notes);
        if (this.notes.length === 0) {
          this.close();
        }
      }
    })
    return await modal.present();
  }

  async close() {
    this.storage.set('inOrder', false);
    this.afs.collection(`trucks`).doc(this.truckCode).update({ assigned: false });
    this.router.navigate(['home'])
  }

}

/*

save() {
    var total = 0;
    for (var i = 0; i < this.notes.length; i++) {
      console.log(this.notes[i].deliveryDetails.gotAll)
      if (this.notes[i].pod !== '' && this.notes[i].pod !== undefined) {
        total = total + 1;
      } else if (this.notes[i].deliveryDetails.gotAll !== undefined) {
        total = total + 1;
      }
      else {
        this.missingPOD(this.notes[i])
      }
    }
    if (total === this.notes.length) {
      this.save2();
    }
  }

  async save2() {
    this.loadMsg = await this.loadingCtrl.create({
      message: 'Syncing, Please Wait',
      translucent: true
    });
    await this.loadMsg.present();
    this.checkConn();
    })
  }

  checkConn() {
    setTimeout(() => {
      this.connection.internetCheck().then(res => {
        if (res == true) {
          this.connectionFound();
          this.toast.show('Order Completed!')
          this.loadMsg.dismiss()
        } else {
          // err => console.log(err)
          this.checkConn();
        }
      })
    }, 1000);
  }

  connectionFound() {
    console.log('In Save')
    this.notes.forEach(note => {
      note.status = 'Complete';
      note.completedDate = moment(new Date()).format('YYYY/MM/DD HH:mm');
      this.afs.collection('orders').doc(note.key).set(note).then(() => {
        this.afs.collection('delivery-notes').doc(note.key).delete()
      })
    })
    this.storage.set('inOrder', false);
    this.afs.collection(`trucks`).doc(this.notes[0].code).update({ assigned: false });
    this.router.navigate(['home'])
  }

  currentMarker() {
    let promise = new Promise((resolve, reject) => {
      console.log("Getting Location")
      this.geolocation.getCurrentPosition().then((resp) => {
        console.log(resp)
        if (resp.coords.latitude) {
          this.currentPos.lat = resp.coords.latitude;
          this.currentPos.lng = resp.coords.longitude;
          this.notes.forEach(note => {
            this.afs.collection(`delivery-notes`).doc(note.key).update({
              currentPos: {
                lat: resp.coords.latitude,
                lng: resp.coords.longitude,
              },
              currentUpdate: moment(new Date()).format('YYYY/MM/DD HH:mm')
            });
            resolve(true)
          })
        } else {
          setTimeout(() => {
            this.currentMarker();
          }, 3000);
        }
      }).catch((error) => {
        console.log('Error getting location', error);
      });
    })
    return promise;
  }

   track() {
    this.locationSubscription = this.geolocation.watchPosition();
    this.locationSubscription.subscribe((resp) => {

      this.locationWatchStarted = true;
      console.log("Watch Lat: " + resp.coords.latitude)
      console.log("Watch Lng: " + resp.coords.longitude)
      setTimeout(() => {
        if (resp.coords.accuracy < 300) {
          this.notes.forEach(note => {
            this.afs.collection(`delivery-notes`).doc(note.key).update({
              currentPos: {
                lat: resp.coords.latitude,
                lng: resp.coords.longitude,
                accuracy: resp.coords.accuracy,
              },
              currentUpdate: moment(new Date()).format('YYYY/MM/DD HH:mm')
            });
          })
          this.currentPos.lat = resp.coords.latitude;
          this.currentPos.lng = resp.coords.longitude;
          this.setMarkers();
        }
      }, 300000);  // Set at one minute ( between 5 & 10? )
    });
  }

  */
