import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Router } from '@angular/router';
import { dismantleLicDisk } from '../utils/utility';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-dieselbay-scan',
  templateUrl: './dieselbay-scan.page.html',
  styleUrls: ['./dieselbay-scan.page.scss'],
}) 
export class DieselbayScanPage implements OnInit {

  code;
  type;
  checkType;

  displayType;

  checked = false;

  constructor(private afs: AngularFirestore, private barcodeScanner: BarcodeScanner, public router: Router, public alertCtrl: AlertController) { }

  ngOnInit() {
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
      console.log(this.code);
      // Using this code to determine the unit type (truck/trailer/driver)
      this.afs.collection('codes').doc(this.code).ref.get().then(async (data: any) => {
        if (data.data()) {
          this.type = data.data().type;
          if (this.type === 'trucks') {
            this.displayType = 'truck';
          } else {
            this.displayType = 'trailer';
          }
          console.log(this.type);
          // Uses this type to search the correct collection. Gets info on unit
          this.afs.collection(this.type).doc(this.code).ref.get().then(async (info: any) => {
            if (info.data()) {

              if (info.data().jobNo !== '') {

              await this.checkInspecs(info.data().jobNo)
              this.checked = true;

              } else {
                this.checkinAlert();
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

  async checkInspecs(jobNo) {
    this.afs.collection('inspections').ref.where('jobNo', '==', jobNo).where('type', '==', 'dieselbay').limit(1).get().then(query => {
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
          text: 'OK',
          handler: data => {
            this.router.navigate(['home'])
          }
        },
      ]
    });
    return await prompt.present();
  }


  route() {
    this.router.navigate([`dieselbay-inspection`, { id1: this.code, id2: this.type }]);
  }

}


