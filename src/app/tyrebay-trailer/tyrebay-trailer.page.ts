import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import moment from 'moment';
import { UUID } from 'angular2-uuid';
import { AngularFirestore } from '@angular/fire/firestore';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { LoadingService } from '../services/loading.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { ToastService } from '../services/toast.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-tyrebay-trailer',
  templateUrl: './tyrebay-trailer.page.html',
  styleUrls: ['./tyrebay-trailer.page.scss'],
})
export class TyrebayTrailerPage implements OnInit {

  saved = false;

  code;
  type;
  checkType;

  trailerSml = {
    type: 'tyrebay', report: 'Tyrebay Check', key: '', code: '', date: '', timeIn: '', timeOut: '', duration: {}, trailerReg: '', trailerFleet: '', trailerFleetNo: '', checkType: '', jobNo: '',
    controller: '', controllerSig: '', //mechanic: '', mechanicSig: '', foreman: '', foremanSig: '',
    cap: false, ext: false, condition: '', pipe: false, progress: 0, deviations: [],
  };

  trailerMid = {
    type: 'tyrebay', report: 'Tyrebay Check', key: '', code: '', date: '', timeIn: '', timeOut: '', duration: {}, trailerReg: '',  trailerFleet: '', trailerFleetNo: '', checkType: '', jobNo: '',
    controller: '', controllerSig: '', //mechanic: '', mechanicSig: '', foreman: '', foremanSig: '',
    cap: false, ext: false, torqued: false, condition: '', pipe: false, notes: '', progress: 0, deviations: [],
  };

  trailerLrg = {
    type: 'tyrebay', report: 'Tyrebay Check', key: '', code: '', date: '', timeIn: '', timeOut: '', duration: {}, trailerReg: '',  trailerFleet: '', trailerFleetNo: '', checkType: '', jobNo: '',
    controller: '', controllerSig: '', //mechanic: '', mechanicSig: '', foreman: '', foremanSig: '',
    cap: false, ext: false, torqued: false, condition: '', tool: false, branding: false, rims: false, notes: '', progress: 0, deviations: [],
  };

  isDrawing1 = true;
  isDrawing2 = true;
  isDrawing3 = true;

  signaturePadOptions: Object = {
    minWidth: 2,
    backgroundColor: '#fff',
    penColor: '#000',
    canvasWidth: 250
  };

  //mechanics = [];
  //controllers = [];
  //foreman = [];

  showCrop = false;
  cropImageInput: any;
  cropImageOutput: any;

  allowdedFileExtentions = '';

  fileTypes: any = [];
  permittedFileTypes: any = [];
  photos = [];

  imageChangedEvent: any = '';

  downloadURL: Observable<string | null>;

  deviations = {
    note1: '', note2: '', note3: '', note4: '', note5: '', note6: '', note7: '', note8: '', note9: '', note10: '',
    photo1: '', photo2: '', photo3: '', photo4: '', photo5: '', photo6: '', photo7: '', photo8: '', photo9: '', photo10: '',
  }

  optionA1;
  optionA2;
  optionB1;
  optionB2;
  optionC1;
  optionC2;
  optionD1;
  optionD2;
  optionE1;
  optionE2;
  optionF1;
  optionF2;
  optionG1;
  optionG2;

  loadActive = false;

  @ViewChild('imageChooser1', { static: false }) filePickerRef1: ElementRef<HTMLInputElement>;
  @ViewChild('imageChooser2', { static: false }) filePickerRef2: ElementRef<HTMLInputElement>;
  @ViewChild('imageChooser3', { static: false }) filePickerRef3: ElementRef<HTMLInputElement>;
  @ViewChild('imageChooser4', { static: false }) filePickerRef4: ElementRef<HTMLInputElement>;
  @ViewChild('imageChooser5', { static: false }) filePickerRef5: ElementRef<HTMLInputElement>;
  @ViewChild('imageChooser6', { static: false }) filePickerRef6: ElementRef<HTMLInputElement>;
  @ViewChild('imageChooser7', { static: false }) filePickerRef7: ElementRef<HTMLInputElement>;

  //@ViewChild('sigpad1', { static: false }) sigPad1: SignaturePad;
  @ViewChild('sigpad2', { static: false }) sigPad2: SignaturePad;
  //@ViewChild('sigpad3', { static: false }) sigPad3: SignaturePad;

  constructor(public activatedRoute: ActivatedRoute, private storage: Storage, private afs: AngularFirestore,
    public alertCtrl: AlertController, public loading: LoadingService, public router: Router, public toast: ToastService, private afStorage: AngularFireStorage, private camera: Camera,
    public actionSheetController: ActionSheetController, public alertController: AlertController) { }

  ngOnInit() {
    this.code = this.activatedRoute.snapshot.paramMap.get('id1');
    this.type = this.activatedRoute.snapshot.paramMap.get('id2');
    this.checkType = this.activatedRoute.snapshot.paramMap.get('id3');
    console.log(this.code, this.checkType);
    this.afs.collection('trailers').doc(this.code).ref.get().then((trailer: any) => {

      if (this.checkType === 'Small') {
        this.trailerSml.code = this.code;
        this.trailerSml.checkType = this.checkType;
        this.trailerSml.trailerReg = trailer.data().registration;
        this.trailerSml.trailerFleet = trailer.data().fleet;
        this.trailerSml.trailerFleetNo = trailer.data().fleetNo;
        this.trailerSml.jobNo = trailer.data().jobNo
        this.trailerSml.date = moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD');
        this.trailerSml.timeIn = moment(new Date().toISOString()).locale('en').format('HH:mm');
        this.trailerSml.key = UUID.UUID();
        this.afs.collection('inspections').doc(this.trailerSml.key).set(this.trailerSml);
      } else if (this.checkType === 'Medium') {
        this.trailerMid.code = this.code;
        this.trailerMid.checkType = this.checkType;
        this.trailerMid.trailerReg = trailer.data().registration;
        this.trailerMid.trailerFleet = trailer.data().fleet;
        this.trailerMid.trailerFleetNo = trailer.data().fleetNo;
        this.trailerMid.jobNo = trailer.data().jobNo
        this.trailerMid.date = moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD');
        this.trailerMid.timeIn = moment(new Date().toISOString()).locale('en').format('HH:mm');
        this.trailerMid.key = UUID.UUID();
        this.afs.collection('inspections').doc(this.trailerMid.key).set(this.trailerMid);
      } else {
        this.trailerLrg.code = this.code;
        this.trailerLrg.checkType = this.checkType;
        this.trailerLrg.trailerReg = trailer.data().registration;
        this.trailerLrg.trailerFleet = trailer.data().fleet;
        this.trailerLrg.trailerFleetNo = trailer.data().fleetNo;
        this.trailerLrg.jobNo = trailer.data().jobNo
        this.trailerLrg.date = moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD');
        this.trailerLrg.timeIn = moment(new Date().toISOString()).locale('en').format('HH:mm');
        this.trailerLrg.key = UUID.UUID();
        this.afs.collection('inspections').doc(this.trailerLrg.key).set(this.trailerLrg);
      }
      this.getUser();
    });
  }

  getUser() {
    this.storage.get('user').then(user => {
      if (this.checkType === 'Small') {
        this.trailerSml.controller = user.name
      } else if (this.checkType === 'Medium') {
        this.trailerMid.controller = user.name
      } else {
        this.trailerLrg.controller = user.name
      }
    })
  }

  drawStart2() {
    this.isDrawing2 = true;
  }

  drawComplete2() {
    this.isDrawing2 = false;
    if (this.checkType === 'Small') {
      this.trailerSml.controllerSig = this.sigPad2.toDataURL();
    } else if (this.checkType === 'Medium') {
      this.trailerMid.controllerSig = this.sigPad2.toDataURL();
    } else {
      this.trailerLrg.controllerSig = this.sigPad2.toDataURL();
    }
  }

  clearPad2() {
    this.sigPad2.clear();
    if (this.checkType === 'Small') {
      this.trailerSml.controllerSig = '';
    } else if (this.checkType === 'Medium') {
      this.trailerMid.controllerSig = '';
    } else {
      this.trailerLrg.controllerSig = '';
    }
  }

  update() {
    if (this.checkType === 'Small') {
      this.trailerSml.progress = 0;
      if (this.trailerSml.jobNo !== '') {
        this.trailerSml.progress = this.trailerSml.progress + 1;
      }
      if (this.optionA1 === true || this.optionA2 === true) {
        this.trailerSml.progress = this.trailerSml.progress + 1;
        if (this.optionA2 === true) {
          var devs = {
            key: UUID.UUID(),
            date:  moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
            time: moment(new Date().toISOString()).locale('en').format('HH:mm'),
            code: this.trailerSml.trailerReg,
            fleet: this.trailerSml.trailerFleet,
            fleetNo: this.trailerSml.trailerFleetNo,
            status: 'Pending',
            inspection: this.trailerSml.type
          };
          this.afs.collection('deviations').doc(devs.key).set(devs);
        }
      }
      if (this.optionB1 === true || this.optionB2 === true) {
        this.trailerSml.progress = this.trailerSml.progress + 1;
        if (this.optionB2 === true) {
          var devs = {
            key: UUID.UUID(),
            date:  moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
            time: moment(new Date().toISOString()).locale('en').format('HH:mm'),
            code: this.trailerSml.trailerReg,
            fleet: this.trailerSml.trailerFleet,
            fleetNo: this.trailerSml.trailerFleetNo,
            status: 'Pending',
            inspection: this.trailerSml.type
          };
          this.afs.collection('deviations').doc(devs.key).set(devs);
        }
      }
      if (this.trailerSml.condition !== '') {
        this.trailerSml.progress = this.trailerSml.progress + 1;
        if (this.trailerSml.condition === '25%') {
          var devs = {
            key: UUID.UUID(),
            date:  moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
            time: moment(new Date().toISOString()).locale('en').format('HH:mm'),
            code: this.trailerSml.trailerReg,
            fleet: this.trailerSml.trailerFleet,
            fleetNo: this.trailerSml.trailerFleetNo,
            status: 'Pending',
            inspection: this.trailerSml.type
          };
          this.afs.collection('deviations').doc(devs.key).set(devs);
        }
      }
      if (this.optionD1 === true || this.optionD2 === true) {
        this.trailerSml.progress = this.trailerSml.progress + 1;
        if (this.optionD2 === true) {
          var devs = {
            key: UUID.UUID(),
            date:  moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
            time: moment(new Date().toISOString()).locale('en').format('HH:mm'),
            code: this.trailerSml.trailerReg,
            fleet: this.trailerSml.trailerFleet,
            fleetNo: this.trailerSml.trailerFleetNo,
            status: 'Pending',
            inspection: this.trailerSml.type
          };
          this.afs.collection('deviations').doc(devs.key).set(devs);
        }
      }
      this.trailerSml.progress = this.trailerSml.progress / 5;
      this.afs.collection('inspections').doc(this.trailerSml.key).update(this.trailerSml);
      if (this.trailerSml.progress === 0) {
        var status = 'In Queue';
      } else if (this.trailerSml.progress > 0 && this.trailerSml.progress < 1) {
        var status = 'In Progress';
      } else if (this.trailerSml.progress === 1) {
        var status = 'Completed';
      }
      this.afs.collection('trailers').doc(this.trailerSml.trailerReg).update({
        tyrebayStatus: status,
        tyrebayProgress: this.trailerSml.progress,
        timeStamp: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD, HH:mm'),
        lastInspection: 'TyreBay',
        lastInspectionTimestamp: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD, HH:mm'),
      });
    } else if (this.checkType === 'Medium') {

      this.trailerMid.progress = 0;
      if (this.trailerMid.jobNo !== '') {
        this.trailerMid.progress = this.trailerMid.progress + 1;
      }
      if (this.optionA1 === true || this.optionA2 === true) {
        this.trailerMid.progress = this.trailerMid.progress + 1;
        if (this.optionA2 === true) {
          var devs = {
            key: UUID.UUID(),
            date:  moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
            time: moment(new Date().toISOString()).locale('en').format('HH:mm'),
            code: this.trailerMid.trailerReg,
            fleet: this.trailerMid.trailerFleet,
            fleetNo: this.trailerMid.trailerFleetNo,
            status: 'Pending',
            inspection: this.trailerMid.type
          };
          this.afs.collection('deviations').doc(devs.key).set(devs);
        }
      }
      if (this.optionB1 === true || this.optionB2 === true) {
        this.trailerMid.progress = this.trailerMid.progress + 1;
        if (this.optionB2 === true) {
          var devs = {
            key: UUID.UUID(),
            date:  moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
            time: moment(new Date().toISOString()).locale('en').format('HH:mm'),
            code: this.trailerMid.trailerReg,
            fleet: this.trailerMid.trailerFleet,
            fleetNo: this.trailerMid.trailerFleetNo,
            status: 'Pending',
            inspection: this.trailerMid.type
          };
          this.afs.collection('deviations').doc(devs.key).set(devs);
        }
      }
      if (this.optionC1 === true || this.optionC2 === true) {
        this.trailerMid.progress = this.trailerMid.progress + 1;
        if (this.optionC2 === true) {
          var devs = {
            key: UUID.UUID(),
            date:  moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
            time: moment(new Date().toISOString()).locale('en').format('HH:mm'),
            code: this.trailerMid.trailerReg,
            fleet: this.trailerMid.trailerFleet,
            fleetNo: this.trailerMid.trailerFleetNo,
            status: 'Pending',
            inspection: this.trailerMid.type
          };
          this.afs.collection('deviations').doc(devs.key).set(devs);
        }
      }
      if (this.trailerMid.condition !== '') {
        this.trailerMid.progress = this.trailerMid.progress + 1;
        if (this.trailerMid.condition === '25%') {
          var devs = {
            key: UUID.UUID(),
            date:  moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
            time: moment(new Date().toISOString()).locale('en').format('HH:mm'),
            code: this.trailerMid.trailerReg,
            fleet: this.trailerMid.trailerFleet,
            fleetNo: this.trailerMid.trailerFleetNo,
            status: 'Pending',
            inspection: this.trailerMid.type
          };
          this.afs.collection('deviations').doc(devs.key).set(devs);
        }
      }
      if (this.optionE1 === true || this.optionE2 === true) {
        this.trailerMid.progress = this.trailerMid.progress + 1;
        if (this.optionE2 === true) {
          var devs = {
            key: UUID.UUID(),
            date:  moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
            time: moment(new Date().toISOString()).locale('en').format('HH:mm'),
            code: this.trailerMid.trailerReg,
            fleet: this.trailerMid.trailerFleet,
            fleetNo: this.trailerMid.trailerFleetNo,
            status: 'Pending',
            inspection: this.trailerMid.type
          };
          this.afs.collection('deviations').doc(devs.key).set(devs);
        }
      }
      this.trailerMid.progress = this.trailerMid.progress / 6;

      this.afs.collection('inspections').doc(this.trailerMid.key).update(this.trailerMid);
      if (this.trailerMid.progress === 0) {
        var status = 'In Queue';
      } else if (this.trailerMid.progress > 0 && this.trailerMid.progress < 1) {
        var status = 'In Progress';
      } else if (this.trailerMid.progress === 1) {
        var status = 'Completed';
      }
      this.afs.collection('trailers').doc(this.trailerMid.trailerReg).update({
        tyrebayStatus: status,
        tyrebayProgress: this.trailerMid.progress,
        timeStamp: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD, HH:mm'),
        lastInspection: 'TyreBay',
        lastInspectionTimestamp: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD, HH:mm'),
      });
    } else {

      this.trailerLrg.progress = 0;
      if (this.trailerLrg.jobNo !== '') {
        this.trailerLrg.progress = this.trailerLrg.progress + 1;
      }
      if (this.optionA1 === true || this.optionA2 === true) {
        this.trailerLrg.progress = this.trailerLrg.progress + 1;
        if (this.optionA2 === true) {
          var devs = {
            key: UUID.UUID(),
            date:  moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
            time: moment(new Date().toISOString()).locale('en').format('HH:mm'),
            code: this.trailerLrg.trailerReg,
            fleet: this.trailerLrg.trailerFleet,
            fleetNo: this.trailerLrg.trailerFleetNo,
            status: 'Pending',
            inspection: this.trailerLrg.type
          };
          this.afs.collection('deviations').doc(devs.key).set(devs);
        }
      }
      if (this.optionB1 === true || this.optionB2 === true) {
        this.trailerLrg.progress = this.trailerLrg.progress + 1;
        if (this.optionB2 === true) {
          var devs = {
            key: UUID.UUID(),
            date:  moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
            time: moment(new Date().toISOString()).locale('en').format('HH:mm'),
            code: this.trailerLrg.trailerReg,
            fleet: this.trailerLrg.trailerFleet,
            fleetNo: this.trailerLrg.trailerFleetNo,
            status: 'Pending',
            inspection: this.trailerLrg.type
          };
          this.afs.collection('deviations').doc(devs.key).set(devs);
        }
      }
      if (this.optionC1 === true || this.optionC2 === true) {
        this.trailerLrg.progress = this.trailerLrg.progress + 1;
        if (this.optionC2 === true) {
          var devs = {
            key: UUID.UUID(),
            date:  moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
            time: moment(new Date().toISOString()).locale('en').format('HH:mm'),
            code: this.trailerLrg.trailerReg,
            fleet: this.trailerLrg.trailerFleet,
            fleetNo: this.trailerLrg.trailerFleetNo,
            status: 'Pending',
            inspection: this.trailerLrg.type
          };
          this.afs.collection('deviations').doc(devs.key).set(devs);
        }
      }
      if (this.trailerLrg.condition !== '') {
        this.trailerLrg.progress = this.trailerLrg.progress + 1;
        if (this.trailerLrg.condition === '25%') {
          var devs = {
            key: UUID.UUID(),
            date:  moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
            time: moment(new Date().toISOString()).locale('en').format('HH:mm'),
            code: this.trailerLrg.trailerReg,
            fleet: this.trailerLrg.trailerFleet,
            fleetNo: this.trailerLrg.trailerFleetNo,
            status: 'Pending',
            inspection: this.trailerLrg.type
          };
          this.afs.collection('deviations').doc(devs.key).set(devs);
        }
      }
      if (this.optionE1 === true || this.optionE2 === true) {
        this.trailerLrg.progress = this.trailerLrg.progress + 1;
        if (this.optionE2 === true) {
          var devs = {
            key: UUID.UUID(),
            date:  moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
            time: moment(new Date().toISOString()).locale('en').format('HH:mm'),
            code: this.trailerLrg.trailerReg,
            fleet: this.trailerLrg.trailerFleet,
            fleetNo: this.trailerLrg.trailerFleetNo,
            status: 'Pending',
            inspection: this.trailerLrg.type
          };
          this.afs.collection('deviations').doc(devs.key).set(devs);
        }
      }
      if (this.optionF1 === true || this.optionF2 === true) {
        this.trailerLrg.progress = this.trailerLrg.progress + 1;
        if (this.optionF2 === true) {
          var devs = {
            key: UUID.UUID(),
            date:  moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
            time: moment(new Date().toISOString()).locale('en').format('HH:mm'),
            code: this.trailerLrg.trailerReg,
            fleet: this.trailerLrg.trailerFleet,
            fleetNo: this.trailerLrg.trailerFleetNo,
            status: 'Pending',
            inspection: this.trailerLrg.type
          };
          this.afs.collection('deviations').doc(devs.key).set(devs);
        }
      }
      if (this.optionG1 === true || this.optionG2 === true) {
        this.trailerLrg.progress = this.trailerLrg.progress + 1;
        if (this.optionG2 === true) {
          var devs = {
            key: UUID.UUID(),
            date:  moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
            time: moment(new Date().toISOString()).locale('en').format('HH:mm'),
            code: this.trailerLrg.trailerReg,
            fleet: this.trailerLrg.trailerFleet,
            fleetNo: this.trailerLrg.trailerFleetNo,
            status: 'Pending',
            inspection: this.trailerLrg.type
          };
          this.afs.collection('deviations').doc(devs.key).set(devs);
        }
      }
      this.trailerLrg.progress = this.trailerLrg.progress / 8;
      this.afs.collection('inspections').doc(this.trailerLrg.key).update(this.trailerLrg);
      if (this.trailerLrg.progress === 0) {
        var status = 'In Queue';
      } else if (this.trailerLrg.progress > 0 && this.trailerLrg.progress < 1) {
        var status = 'In Progress';
      } else if (this.trailerLrg.progress === 1) {
        var status = 'Completed';
      }
      this.afs.collection('trailers').doc(this.trailerLrg.trailerReg).update({
        tyrebayStatus: status,
        tyrebayProgress: this.trailerLrg.progress,
        timeStamp: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD, HH:mm'),
        lastInspection: 'TyreBay',
        lastInspectionTimestamp: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD, HH:mm'),
      });
    }
  }

  save() {
    this.saved = true;
    if (this.checkType === 'Small') {
      this.getDevSml();
      this.loading.present('Saving, Please wait...').then(() => {
        // Calculate time to complete inspection
        this.trailerSml.timeOut = moment(new Date().toISOString()).locale('en').format('HH:mm');
        this.trailerSml.duration = moment(this.trailerSml.timeOut, 'HH:mm').diff(moment(this.trailerSml.timeIn, 'HH:mm'), 'minutes', true);

        // Save inspection
        this.afs.collection('inspections').doc(this.trailerSml.key).update(this.trailerSml);
        this.router.navigate(['home']);
        this.loading.dismiss();
      });
    }
    else if (this.checkType === 'Medium') {
      this.getDevMid();
      this.loading.present('Saving, Please wait...').then(() => {
        // Calculate time to complete inspection
        this.trailerMid.timeOut = moment(new Date().toISOString()).locale('en').format('HH:mm');
        this.trailerMid.duration = moment(this.trailerMid.timeOut, 'HH:mm').diff(moment(this.trailerMid.timeIn, 'HH:mm'), 'minutes', true);

        // Save inspection
        this.afs.collection('inspections').doc(this.trailerMid.key).update(this.trailerMid);
        this.router.navigate(['home']);
        this.loading.dismiss();
      });
    } else {
      this.getDevLrg()
      this.loading.present('Saving, Please wait...').then(() => {
        // Calculate time to complete inspection
        this.trailerLrg.timeOut = moment(new Date().toISOString()).locale('en').format('HH:mm');
        this.trailerLrg.duration = moment(this.trailerLrg.timeOut, 'HH:mm').diff(moment(this.trailerLrg.timeIn, 'HH:mm'), 'minutes', true);

        // Save inspection
        this.afs.collection('inspections').doc(this.trailerLrg.key).update(this.trailerLrg);
        this.router.navigate(['home']);
        this.loading.dismiss();
      });
    }
  }

  check() {
    if (this.checkType === 'Small') {

      if (this.optionA2 === true && this.deviations.note1 === '') {
        return this.devMsg('Valve Cap')
      }
      if (this.optionB2 === true && this.deviations.note2 === '') {
        return this.devMsg('Valve Ext')
      }
      if (this.trailerSml.condition === '25%' && this.deviations.note3 === '') {
        return this.devMsg('Condition')
      }
      if (this.optionD2 === true && this.deviations.note4 === '') {
        return this.devMsg('Check Tyre with a pipe')
      }

      if (this.trailerSml.jobNo !== '') {
        if (this.optionA1 === true || this.optionA2 === true) {
          if (this.optionB1 === true || this.optionB2 === true) {
            if (this.trailerSml.condition !== '') {
              if (this.optionD1 === true || this.optionD2 === true) {
                if (this.trailerSml.controllerSig !== '') {
                  return this.save()
                } else {
                  this.alertMsg('Signature')
                }
              } else {
                this.alertMsg('Check Tyre with a pipe')
              }
            } else {
              this.alertMsg('Condition')
            }
          } else {
            this.alertMsg('Valve Ext')
          }
        } else {
          this.alertMsg('Valve Cap')
        }
      } else {
        this.alertMsg('Job Card Number')
      }
    } else if (this.checkType === 'Medium') {

      if (this.optionA2 === true && this.deviations.note1 === '') {
        return this.devMsg('Valve Cap')
      }
      if (this.optionB2 === true && this.deviations.note2 === '') {
        return this.devMsg('Valve Ext')
      }
      if (this.optionC2 === true && this.deviations.note3 === '') {
        return this.devMsg('Torqued')
      }
      if (this.trailerMid.condition === '25%' && this.deviations.note4 === '') {
        return this.devMsg('Condition')
      }
      if (this.optionE2 === true && this.deviations.note5 === '') {
        return this.devMsg('Check Tyre with a pipe')
      }
      if (this.trailerMid.jobNo !== '') {
        if (this.optionA1 === true || this.optionA2 === true) {
          if (this.optionB1 === true || this.optionB2 === true) {
            if (this.optionC1 === true || this.optionC2 === true) {
              if (this.trailerMid.condition !== '') {
                if (this.optionE1 === true || this.optionE2 === true) {
                  if (this.trailerMid.controllerSig !== '') {
                    return this.save()
                  } else {
                    this.alertMsg('Signature')
                  }
                } else {
                  this.alertMsg('Check Tyre with a pipe')
                }
              } else {
                this.alertMsg('Condition')
              }
            } else {
              this.alertMsg('Torqued')
            }
          } else {
            this.alertMsg('Valve Ext')
          }
        } else {
          this.alertMsg('Valve Cap')
        }
      } else {
        this.alertMsg('Job Card Number')
      }
    } else {

      if (this.optionA2 === true && this.deviations.note1 === '') {
        return this.devMsg('Valve Cap')
      }
      if (this.optionB2 === true && this.deviations.note2 === '') {
        return this.devMsg('Valve Ext')
      }
      if (this.optionC2 === true && this.deviations.note3 === '') {
        return this.devMsg('Torqued')
      }
      if (this.trailerLrg.condition === '25%' && this.deviations.note4 === '') {
        return this.devMsg('Condition')
      }
      if (this.optionE2 === true && this.deviations.note5 === '') {
        return this.devMsg('Electronic survey tool')
      }
      if (this.optionF2 === true && this.deviations.note6 === '') {
        return this.devMsg('Branding of Tyres')
      }
      if (this.optionG2 === true && this.deviations.note7 === '') {
        return this.devMsg('Spraying Rims')
      }

      if (this.trailerLrg.jobNo !== '') {
        if (this.optionA1 === true || this.optionA2 === true) {
          if (this.optionB1 === true || this.optionB2 === true) {
            if (this.optionC1 === true || this.optionC2 === true) {
              if (this.trailerLrg.condition !== '') {
                if (this.optionE1 === true || this.optionE2 === true) {
                  if (this.optionF1 === true || this.optionF2 === true) {
                    if (this.optionG1 === true || this.optionG2 === true) {
                      if (this.trailerLrg.controllerSig !== '') {
                        this.save()
                      } else {
                        this.alertMsg('Signature')
                      }
                    } else {
                      this.alertMsg('Spraying Rims')
                    }
                  } else {
                    this.alertMsg('Branding of Tyres')
                  }
                } else {
                  this.alertMsg('Electronic survey tool')
                }
              } else {
                this.alertMsg('Condition')
              }
            } else {
              this.alertMsg('Torqued')
            }
          } else {
            this.alertMsg('Valve Ext')
          }
        } else {
          this.alertMsg('Valve Cap')
        }
      } else {
        this.alertMsg('Job Card Number')
      }
    }
  }

  async alertMsg(item) {
    let prompt = await this.alertCtrl.create({
      header: 'Invalid Check',
      message: `This check is missing the following field: ${item}`,
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

  async devMsg(item) {
    let prompt = await this.alertCtrl.create({
      header: 'Invalid Deviation',
      message: `Please provide a note for why you selected 'No' for ${item}`,
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

  getDevSml() {
    this.trailerSml.cap = this.optionA1;
    this.trailerSml.ext = this.optionB1;
    // this.trailerSml.condition = this.optionC1;
    this.trailerSml.pipe = this.optionD1;
    if (this.deviations.note1 !== '') {
      this.trailerSml.deviations.push({ item: 'Valve Cap', note: this.deviations.note1, photo: this.deviations.photo1 })
    }
    if (this.deviations.note2 !== '') {
      this.trailerSml.deviations.push({ item: 'Valve Ext', note: this.deviations.note2, photo: this.deviations.photo2 })
    }
    if (this.deviations.note3 !== '') {
      this.trailerSml.deviations.push({ item: 'Condition', note: this.deviations.note3, photo: this.deviations.photo3 })
    }
    if (this.deviations.note4 !== '') {
      this.trailerSml.deviations.push({ item: 'Check Tyres with a pipe', note: this.deviations.note4, photo: this.deviations.photo4 })
    }
  }

  getDevMid() {
    this.trailerMid.cap = this.optionA1;
    this.trailerMid.ext = this.optionB1;
    this.trailerMid.torqued = this.optionC1;
    // this.trailerMid.condition = this.optionD1;
    this.trailerMid.pipe = this.optionE1;

    if (this.deviations.note1 !== '') {
      this.trailerMid.deviations.push({ item: 'Valve Cap', note: this.deviations.note1, photo: this.deviations.photo1 })
    }
    if (this.deviations.note2 !== '') {
      this.trailerMid.deviations.push({ item: 'Valve Ext', note: this.deviations.note2, photo: this.deviations.photo2 })
    }
    if (this.deviations.note3 !== '') {
      this.trailerMid.deviations.push({ item: 'Torqued', note: this.deviations.note3, photo: this.deviations.photo3 })
    }
    if (this.deviations.note4 !== '') {
      this.trailerMid.deviations.push({ item: 'Condition', note: this.deviations.note4, photo: this.deviations.photo4 })
    }
    if (this.deviations.note5 !== '') {
      this.trailerMid.deviations.push({ item: 'Check Tyres with a pipe', note: this.deviations.note5, photo: this.deviations.photo5 })
    }
  }

  getDevLrg() {
    this.trailerLrg.cap = this.optionA1;
    this.trailerLrg.ext = this.optionB1;
    this.trailerLrg.torqued = this.optionC1;
    // this.trailerLrg.condition = this.optionD1;
    this.trailerLrg.tool = this.optionE1;
    this.trailerLrg.branding = this.optionF1;
    this.trailerLrg.rims = this.optionG1;

    if (this.deviations.note1 !== '') {
      this.trailerLrg.deviations.push({ item: 'Valve Cap', note: this.deviations.note1, photo: this.deviations.photo1 })
    }
    if (this.deviations.note2 !== '') {
      this.trailerLrg.deviations.push({ item: 'Valve Ext', note: this.deviations.note2, photo: this.deviations.photo2 })
    }
    if (this.deviations.note3 !== '') {
      this.trailerLrg.deviations.push({ item: 'Torqued', note: this.deviations.note3, photo: this.deviations.photo3 })
    }
    if (this.deviations.note4 !== '') {
      this.trailerLrg.deviations.push({ item: 'Condition', note: this.deviations.note4, photo: this.deviations.photo4 })
    }
    if (this.deviations.note5 !== '') {
      this.trailerLrg.deviations.push({ item: 'Electronic survey tool', note: this.deviations.note5, photo: this.deviations.photo5 })
    }
    if (this.deviations.note6 !== '') {
      this.trailerLrg.deviations.push({ item: 'Branding of Tyres', note: this.deviations.note6, photo: this.deviations.photo6 })
    }
    if (this.deviations.note7 !== '') {
      this.trailerLrg.deviations.push({ item: 'Spraying Rims', note: this.deviations.note7, photo: this.deviations.photo7 })
    }
  }


  /////////    Deviation Photos      /////////

  async presentActionSheet(photo, file) {
    const actionSheet = await this.actionSheetController.create({
      mode: 'ios',
      header: 'Image Source',
      buttons: [{
        text: 'Camera',
        icon: 'camera',
        handler: () => {
          this.takePicture(photo);
        }
      },
      {
        text: 'Attachments',
        icon: 'attach-outline',
        handler: () => {
          file.nativeElement.click();
        }
      }]
    });
    await actionSheet.present();
  }

  // Open Camera Option
  // Return Image as Base64 String

  async takePicture(unit) {
    const options: CameraOptions = {
      quality: 90,
      targetWidth: 300,
      targetHeight: 300,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {

      this.loading.present('Uploading...').then(() => {
        this.loadActive = true;

        var metadata = {
          contentType: 'image/jpeg',
        }

        var key = UUID.UUID();

        let photo = this.afStorage.ref(`deviations/tyrebay/${key}.jpeg`);

        photo.putString(imageData, 'base64', metadata).then(snapshot => {
          this.downloadURL = photo.getDownloadURL();
          this.downloadURL.subscribe(url => {
            if (url) {
              if (unit === 'photo1') {
                this.deviations.photo1 = url;
              } else if (unit === 'photo2') {
                this.deviations.photo2 = url;
              } else if (unit === 'photo3') {
                this.deviations.photo3 = url;
              } else if (unit === 'photo4') {
                this.deviations.photo4 = url;
              } else if (unit === 'photo5') {
                this.deviations.photo5 = url;
              } else if (unit === 'photo6') {
                this.deviations.photo6 = url;
              } else if (unit === 'photo7') {
                this.deviations.photo7 = url;
              }
              this.loading.dismiss().then(() => {
                this.loadActive = false;
                this.toast.show('Photo uploaded Successfully!')
              })
            }
          })
        })
      })
      setTimeout(async () => {
        if (this.loadActive === true) {
          this.loading.dismiss();
          const prompt = await this.alertCtrl.create({
            header: 'A Problem occured',
            message: `The internet connection is not strong enough to save this image. Please try again.`,
            cssClass: 'alert',
            buttons: [
              {
                text: 'OKAY',
                handler: data => {
                }
              },
            ],
          });
          return await prompt.present();
        }
      }, 15000);
    });
  }

  // File selector
  // To do: Error msg on incorrect file type
  onChooseFile(event: Event, unit) {
    console.log(unit)
    const file = (event.target as HTMLInputElement).files[0];

    const reader = new FileReader();

    reader.onload = () => {

      this.loading.present('Uploading...').then(() => {
        this.loadActive = true;

        var key = UUID.UUID();

        const filePath = `deviations/tyrebay/${key}`;
        const fileRef = this.afStorage.ref(filePath);
        const task = this.afStorage.upload(filePath, file);

        // get notified when the download URL is available
        task.snapshotChanges().pipe(
          finalize(() => {
            this.downloadURL = fileRef.getDownloadURL();
            this.downloadURL.subscribe(url => {
              if (url) {
                if (unit === 'photo1') {
                  this.deviations.photo1 = url;
                } else if (unit === 'photo2') {
                  this.deviations.photo2 = url;
                } else if (unit === 'photo3') {
                  this.deviations.photo3 = url;
                } else if (unit === 'photo4') {
                  this.deviations.photo4 = url;
                } else if (unit === 'photo5') {
                  this.deviations.photo5 = url;
                } else if (unit === 'photo6') {
                  this.deviations.photo6 = url;
                } else if (unit === 'photo7') {
                  this.deviations.photo7 = url;
                }
                this.loading.dismiss().then(() => {
                  this.loadActive = false;
                  this.toast.show('Photo Uploaded Successfully!')
                })
              }
            })
          })
        ).subscribe()
      })
      setTimeout(async () => {
        if (this.loadActive === true) {
          this.loading.dismiss();
          const prompt = await this.alertCtrl.create({
            header: 'A Problem occured',
            message: `The internet connection is not strong enough to save this image. Please try again.`,
            cssClass: 'alert',
            buttons: [
              {
                text: 'OKAY',
                handler: data => {
                }
              },
            ],
          });
          return await prompt.present();
        }
      }, 15000);
    };
    reader.readAsDataURL(file);
  }

  removeImage(unit) {
    if (unit === 'photo1') {
      this.deviations.photo1 = '';
    } else if (unit === 'photo2') {
      this.deviations.photo2 = '';
    } else if (unit === 'photo3') {
      this.deviations.photo3 = '';
    } else if (unit === 'photo4') {
      this.deviations.photo4 = '';
    } else if (unit === 'photo5') {
      this.deviations.photo5 = '';
    } else if (unit === 'photo6') {
      this.deviations.photo6 = '';
    } else if (unit === 'photo7') {
      this.deviations.photo7 = '';
    }
  }

  ngOnDestroy() {
    if (this.saved === true) {
    } else {
      if (this.checkType === 'Small') {
        this.afs.collection('inspections').doc(this.trailerSml.key).delete();
        this.afs.collection('trailers').doc(this.trailerSml.code).update({ tyrebayStatus: 'Skipped', tyrebayProgress: 0 });
      } else if (this.checkType === 'Medium') {
        this.afs.collection('inspections').doc(this.trailerMid.key).delete();
        this.afs.collection('trailers').doc(this.trailerMid.code).update({ tyrebayStatus: 'Skipped', tyrebayProgress: 0 });
      } else if (this.checkType === 'Large') {
        this.afs.collection('inspections').doc(this.trailerLrg.key).delete();
        this.afs.collection('trailers').doc(this.trailerLrg.code).update({ tyrebayStatus: 'Skipped', tyrebayProgress: 0 });
      }
    }
  }

  changeA1() {
    if (this.optionA1 === false) {
      this.optionA2 = true;
    } else {
      this.optionA2 = false;
    }
    this.update();
  }
  changeA2() {
    if (this.optionA2 === false) {
      this.optionA1 = true;
    } else {
      this.optionA1 = false;
    }
    this.update();
  }

  changeB1() {
    if (this.optionB1 === false) {
      this.optionB2 = true;
    } else {
      this.optionB2 = false;
    }
    this.update();
  }
  changeB2() {
    if (this.optionB2 === false) {
      this.optionB1 = true;
    } else {
      this.optionB1 = false;
    }
    this.update();
  }
  changeC1() {
    if (this.optionC1 === false) {
      this.optionC2 = true;
    } else {
      this.optionC2 = false;
    }
    this.update();
  }
  changeC2() {
    if (this.optionC2 === false) {
      this.optionC1 = true;
    } else {
      this.optionC1 = false;
    }
    this.update();
  }
  changeD1() {
    if (this.optionD1 === false) {
      this.optionD2 = true;
    } else {
      this.optionD2 = false;
    }
    this.update();
  }
  changeD2() {
    if (this.optionD2 === false) {
      this.optionD1 = true;
    } else {
      this.optionD1 = false;
    }
    this.update();
  }
  changeE1() {
    if (this.optionE1 === false) {
      this.optionE2 = true;
    } else {
      this.optionE2 = false;
    }
    this.update();
  }
  changeE2() {
    if (this.optionE2 === false) {
      this.optionE1 = true;
    } else {
      this.optionE1 = false;
    }
    this.update();
  }
  changeF1() {
    if (this.optionF1 === false) {
      this.optionF2 = true;
    } else {
      this.optionF2 = false;
    }
    this.update();
  }
  changeF2() {
    if (this.optionF2 === false) {
      this.optionF1 = true;
    } else {
      this.optionF1 = false;
    }
    this.update();
  }
  changeG1() {
    if (this.optionG1 === false) {
      this.optionG2 = true;
    } else {
      this.optionG2 = false;
    }
    this.update();
  }
  changeG2() {
    if (this.optionG2 === false) {
      this.optionG1 = true;
    } else {
      this.optionG1 = false;
    }
    this.update();
  }

}


