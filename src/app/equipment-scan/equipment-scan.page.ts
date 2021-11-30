import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Router } from '@angular/router';
import { dismantleLicDisk } from '../utils/utility';

@Component({
  selector: 'app-equipment-scan',
  templateUrl: './equipment-scan.page.html',
  styleUrls: ['./equipment-scan.page.scss'],
})
export class EquipmentScanPage implements OnInit {

  code;
  type;
  checkType;

  displayType;

  checked = false;

  constructor(private afs: AngularFirestore, private barcodeScanner: BarcodeScanner, public router: Router) { }

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
      // Using this code to determine the unit type (truck/trailer/driver)
      this.afs.collection('codes').doc(this.code).ref.get().then((data: any) => {
        if (data.data()) {
          this.type = data.data().type;
          this.type = data.data().type;
          if (this.type === 'trucks') {
            this.displayType = 'truck';
          } else {
            this.displayType = 'trailer';
          }
          console.log(this.type);
          // Uses this type to search the correct collection. Gets info on unit
          this.afs.collection(this.type).doc(this.code).ref.get().then(info => {
            if (info.data()) {
              this.checked = true;
            }
          });
        } else {
          // No Code Exists
        }
      });
    }).catch(err => {
      alert('Error' + err);
    });
  }

  // Route depending on type (truck/trailer)
  route() {
    this.router.navigate([`equipment-inspection`, { id1: this.code, id2: this.type, id3: this.checkType }]);
  }

  // Save checkin
  save() {
    // this.afs.collection('checkins').doc(this.code).
  }

}

