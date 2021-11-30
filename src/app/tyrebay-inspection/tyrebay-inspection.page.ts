import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Router } from '@angular/router';
import { dismantleLicDisk } from '../utils/utility';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tyrebay-inspection',
  templateUrl: './tyrebay-inspection.page.html',
  styleUrls: ['./tyrebay-inspection.page.scss'],
})
export class TyrebayInspectionPage implements OnInit {

  code;
  type;
  checkType;

  truckSmlCheck = false;
  truckMidCheck = false;
  truckLrgCheck = false;
  trailerSmlCheck = false;
  trailerMidCheck = false;
  trailerLrgCheck = false;

  trailers = [];
  trailer;

  route = false;

  constructor(private afs: AngularFirestore, private barcodeScanner: BarcodeScanner, public router: Router, public alertCtrl: AlertController) { }

  ngOnInit() {
    this.afs.collection('trailers').ref.orderBy('fleetNo').get().then(trailers => {
      trailers.forEach(trailer => {
        this.trailers.push(trailer.data());
      })
    })
  }

  scan() {
    this.barcodeScanner.scan({
      showTorchButton: true,
      showFlipCameraButton: true,
      formats: 'QR_CODE,PDF_417'
    }).then(barcodeData => {
      console.log(barcodeData);
      console.log(dismantleLicDisk(barcodeData).RegNum);

      // Getting barcode
      this.code = dismantleLicDisk(barcodeData).RegNum;
      // Using this code to determine the unit type (truck/trailer/driver)
      this.afs.collection('codes').doc(this.code).ref.get().then(async (data: any) => {
        if (data.data()) {
          this.type = data.data().type;
          // Uses this type to search the correct collection. Gets info on unit
          this.afs.collection(this.type).doc(this.code).ref.get().then(async (info: any) => {
            if (info.data()) {
              if (info.data().jobNo !== '') {
                await this.checkInspecs(info.data())
                if (this.type === 'trucks' && info.data().checkType === 'Small') {
                  this.checkType = info.data().checkType;
                  this.truckSmlCheck = true;
                } else if (this.type === 'trucks' && info.data().checkType === 'Medium') {
                  this.checkType = info.data().checkType;
                  this.truckMidCheck = true;
                } else if (this.type === 'trucks' && info.data().checkType === 'Large') {
                  this.checkType = info.data().checkType;
                  this.truckLrgCheck = true;
                } else if (this.type === 'trailers' && info.data().checkType === 'Small') {
                  this.checkType = info.data().checkType;
                  this.trailerSmlCheck = true;
                } else if (this.type === 'trailers' && info.data().checkType === 'Medium') {
                  this.checkType = info.data().checkType;
                  this.trailerMidCheck = true;
                } else if (this.type === 'trailers' && info.data().checkType === 'Large') {
                  this.checkType = info.data().checkType;
                  this.trailerLrgCheck = true;
                }
                this.route = true;
              } else {
                this.checkinAlert()
              }
            } else {
              const prompt = await this.alertCtrl.create({
                header: 'A Problem occured',
                message: `There was a problem when getting this vehicles details. Please check your internet connections and try again.`,
                cssClass: 'alert',
                buttons: [
                  {
                    text: 'OKAY',
                    handler: data => {
                      this.router.navigate(['home'])
                    }
                  },
                ],
                backdropDismiss: false,
              });
              return await prompt.present();
            }
          });
        } else {
          const prompt = await this.alertCtrl.create({
            header: 'This Truck/Trailer does not exist',
            message: `This vehicle has not been checked in at security. Please send the driver back to the Security Check In.`,
            cssClass: 'alert',
            buttons: [
              {
                text: 'OKAY',
                handler: data => {
                  this.router.navigate(['home'])
                }
              },
            ],
            backdropDismiss: false,
          });
          return await prompt.present();
        }
      });
    }).catch(err => {
      alert('Error' + err);
    });
  }

  async updateTrailer(trailer) {
    // console.log(trailer.code)
    if (trailer.jobNo !== '' && trailer.jobNo !== undefined) {
      await this.checkInspecs(trailer)
      this.type = 'trailers';
      this.code = trailer.code;
      if (trailer.checkType === 'Small') {
        this.checkType = trailer.checkType;
        this.trailerSmlCheck = true;
      } else if (trailer.checkType === 'Medium') {
        this.checkType = trailer.checkType;
        this.trailerMidCheck = true;
      } else if (trailer.checkType === 'Large') {
        this.checkType = trailer.checkType;
        this.trailerLrgCheck = true;
      }
      this.route = true
    } else {
      this.checkinAlert()
    }
  }

  async checkinAlert() {
    const prompt = await this.alertCtrl.create({
      header: 'This truck/trailer has not checked in.',
      message: `This vehicle has not completed the Security Check In. Please tell the driver to return to security.`,
      cssClass: 'alert',
      buttons: [
        {
          text: 'OKAY',
          handler: data => {
            this.router.navigate(['home'])
          }
        },
      ],
      backdropDismiss: false,
    });
    return await prompt.present();
  }

  async checkInspecs(trailer) {
    this.afs.collection('inspections').ref.where('code', '==', trailer.code).where('jobNo', '==', trailer.jobNo).where('type', '==', 'tyrebay').limit(1).get().then(query => {
      if (query.size > 0) {
        console.log('Found other check with jobNo')
        this.alert()
      } else {
        return
      }
    })
  }

  async alert() {
    let prompt = await this.alertCtrl.create({
      header: 'Invalid Request!',
      message: `This check has already been completed for this vehicle/job card. Please contact an Operator if this is incorrect.`,
      cssClass: 'alert',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Edit Inspection',
          handler: data => {
            this.router.navigate([`tyrebay-truck`, { id1: this.code, id2: this.type, id3: this.checkType, edit: true }]);
          }
        },
        {
          text: 'OK',
          handler: data => {
            this.router.navigate(['home'])
          }
        },
      ]
    });
    return await prompt.present();
  }

  // Route depending on type (truck/trailer)
  truckRoute() {
    this.router.navigate([`tyrebay-truck`, { id1: this.code, id2: this.type, id3: this.checkType }]);
  }

  trailerRoute() {
    this.router.navigate([`tyrebay-trailer`, { id1: this.code, id2: this.type, id3: this.checkType }]);
  }

  // Save checkin
  save() {
    // this.afs.collection('checkins').doc(this.code).
  }

}

