import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.page.html',
  styleUrls: ['./scan.page.scss'],
})
export class ScanPage implements OnInit {

  id;
  driver;
  vehicle;
  trailer1;
  trailer2;
  driverReg;
  vehicleReg;
  trailer1Reg;
  trailer2Reg;

  constructor(private afs: AngularFirestore, private barcodeScanner: BarcodeScanner, public router: Router) {
  }

  ngOnInit() {
  }

  scanDriver() {
    // alert('Scanning');
    this.driver = null;
    this.barcodeScanner.scan().then(barcodeData => {
      console.log(`Barcode data: ` +  barcodeData);
      this.driver = barcodeData.text;
      // this.afs.collection('codes').doc(this.code)
      this.afs.collection('users').ref.where('code', '==', this.driver).limit(1).get().then(users => {
        this.driverReg = users;
      });
    }).catch(err => {
      alert('Error' + err);
    });
  }

  security() {
    this.router.navigate([`security-check`]);
  }

}