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
  selector: 'app-workshop-trailer',
  templateUrl: './workshop-trailer.page.html',
  styleUrls: ['./workshop-trailer.page.scss'],
})
export class WorkshopTrailerPage implements OnInit {

  saved = false;
  code;
  type;
  checkType;

  trailerSml = {
    type: 'workshop', report: 'Workshop Check', key: '', code: '', date: '', timeIn: '', timeOut: '', duration: {}, trailerReg: '', trailerFleet: '', trailerFleetNo: '', checkType: '', jobNo: '',
    tyre: false, leaks: false, lights: false,
    controller: '', controllerSig: '', progress: 0, deviations: [],
  };

  trailerMid = {
    type: 'workshop', report: 'Workshop Check', key: '', code: '', date: '', timeIn: '', timeOut: '', duration: {}, trailerReg: '', trailerFleet: '', trailerFleetNo: '', checkType: '', jobNo: '',
    air: false, airbags: false, bushes: false, brakes: false, adjust: false,
    wheel: false, licence: false, hubs: false, wear: false, lights: false, notes: '',
    controller: '', controllerSig: '', progress: 0, deviations: [],
  };

  trailerLrg = {
    type: 'workshop', report: 'Workshop Check', key: '', code: '', date: '', timeIn: '', timeOut: '', duration: {}, trailerReg: '', trailerFleet: '', trailerFleetNo: '', checkType: '', jobNo: '',
    air: false, suspension: false, torque: false, spring: false, axle: false, shoes: false, booster: false,
    sensor: false, brakes: false, chassis: false, cracks: false, locks: false, hubs: false, hubodometer: false,
    wear: false, headboard: false, tailboard: false, reflectors: false, defects: false, licence: false, notes: '',
    controller: '', controllerSig: '', progress: 0, deviations: [],
  };

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
  optionH1;
  optionH2;
  optionI1;
  optionI2;
  optionJ1;
  optionJ2;
  optionK1;
  optionK2;
  optionL1;
  optionL2;
  optionM1;
  optionM2;
  optionN1;
  optionN2;
  optionO1;
  optionO2;
  optionP1;
  optionP2;
  optionQ1;
  optionQ2;
  optionR1;
  optionR2;
  optionS1;
  optionS2;
  optionT1;
  optionT2;

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

  //@ViewChild('sigpad1', { static: false }) sigPad1: SignaturePad;
  @ViewChild('sigpad2', { static: false }) sigPad2: SignaturePad;
  //@ViewChild('sigpad3', { static: false }) sigPad3: SignaturePad;

  deviations = {
    note1: '', note2: '', note3: '', note4: '', note5: '', note6: '', note7: '', note8: '', note9: '', note10: '',
    note11: '', note12: '', note13: '', note14: '', note15: '', note16: '', note17: '', note18: '', note19: '', note20: '',
    photo1: '', photo2: '', photo3: '', photo4: '', photo5: '', photo6: '', photo7: '', photo8: '', photo9: '', photo10: '',
    photo11: '', photo12: '', photo13: '', photo14: '', photo15: '', photo16: '', photo17: '', photo18: '', photo19: '', photo20: '',
  }

  showCrop = false;
  cropImageInput: any;
  cropImageOutput: any;

  allowdedFileExtentions = '';

  fileTypes: any = [];
  permittedFileTypes: any = [];
  photos = [];

  loadActive = false;

  imageChangedEvent: any = '';

  downloadURL: Observable<string | null>;

  @ViewChild('imageChooser1', { static: false }) filePickerRef1: ElementRef<HTMLInputElement>;
  @ViewChild('imageChooser2', { static: false }) filePickerRef2: ElementRef<HTMLInputElement>;
  @ViewChild('imageChooser3', { static: false }) filePickerRef3: ElementRef<HTMLInputElement>;
  @ViewChild('imageChooser4', { static: false }) filePickerRef4: ElementRef<HTMLInputElement>;
  @ViewChild('imageChooser5', { static: false }) filePickerRef5: ElementRef<HTMLInputElement>;
  @ViewChild('imageChooser6', { static: false }) filePickerRef6: ElementRef<HTMLInputElement>;
  @ViewChild('imageChooser7', { static: false }) filePickerRef7: ElementRef<HTMLInputElement>;
  @ViewChild('imageChooser8', { static: false }) filePickerRef8: ElementRef<HTMLInputElement>;
  @ViewChild('imageChooser9', { static: false }) filePickerRef9: ElementRef<HTMLInputElement>;
  @ViewChild('imageChooser10', { static: false }) filePickerRef10: ElementRef<HTMLInputElement>;
  @ViewChild('imageChooser11', { static: false }) filePickerRef11: ElementRef<HTMLInputElement>;
  @ViewChild('imageChooser12', { static: false }) filePickerRef12: ElementRef<HTMLInputElement>;
  @ViewChild('imageChooser13', { static: false }) filePickerRef13: ElementRef<HTMLInputElement>;
  @ViewChild('imageChooser14', { static: false }) filePickerRef14: ElementRef<HTMLInputElement>;
  @ViewChild('imageChooser15', { static: false }) filePickerRef15: ElementRef<HTMLInputElement>;
  @ViewChild('imageChooser16', { static: false }) filePickerRef16: ElementRef<HTMLInputElement>;
  @ViewChild('imageChooser17', { static: false }) filePickerRef17: ElementRef<HTMLInputElement>;
  @ViewChild('imageChooser18', { static: false }) filePickerRef18: ElementRef<HTMLInputElement>;
  @ViewChild('imageChooser19', { static: false }) filePickerRef19: ElementRef<HTMLInputElement>;
  @ViewChild('imageChooser20', { static: false }) filePickerRef20: ElementRef<HTMLInputElement>;

  constructor(public activatedRoute: ActivatedRoute, private storage: Storage, private afs: AngularFirestore, private afStorage: AngularFireStorage, public camera: Camera,
    public alertCtrl: AlertController, public loading: LoadingService, public router: Router, public actionSheetController: ActionSheetController, public toast: ToastService,) { }

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
      this.update();
    } else if (this.checkType === 'Medium') {
      this.trailerMid.controllerSig = this.sigPad2.toDataURL();
      this.update();
    } else {
      this.trailerLrg.controllerSig = this.sigPad2.toDataURL();
      this.update();
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
      /*
      if (this.optionA1 === true || this.optionA2 === true) {
        this.trailerSml.progress = this.trailerSml.progress + 1;
      }
      */
      if (this.optionB1 === true || this.optionB2 === true) {
        this.trailerSml.progress = this.trailerSml.progress + 1;
        if (this.optionB2 === true) {
          var devs = {
            key: UUID.UUID(),
            date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
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
      if (this.optionC1 === true || this.optionC2 === true) {
        this.trailerSml.progress = this.trailerSml.progress + 1;
        if (this.optionC2 === true) {
          var devs = {
            key: UUID.UUID(),
            date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
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
      this.trailerSml.progress = this.trailerSml.progress / 3;
      this.afs.collection('inspections').doc(this.trailerSml.key).update(this.trailerSml);
      if (this.trailerSml.progress === 0) {
        var status = 'In Queue';
      } else if (this.trailerSml.progress > 0 && this.trailerSml.progress < 1) {
        var status = 'In Progress';
      } else if (this.trailerSml.progress === 1) {
        var status = 'Completed';
      }
      this.afs.collection('trailers').doc(this.trailerSml.trailerReg).update({
        workshopStatus: status,
        workshopProgress: this.trailerSml.progress,
        timeStamp: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD, HH:mm'),
        lastInspection: 'Workshop',
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
            date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
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
            date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
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
            date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
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
      if (this.optionD1 === true || this.optionD2 === true) {
        this.trailerMid.progress = this.trailerMid.progress + 1;
        if (this.optionD2 === true) {
          var devs = {
            key: UUID.UUID(),
            date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
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
            date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
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
      if (this.optionF1 === true || this.optionF2 === true) {
        this.trailerMid.progress = this.trailerMid.progress + 1;
        if (this.optionF2 === true) {
          var devs = {
            key: UUID.UUID(),
            date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
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
      if (this.optionG1 === true || this.optionG2 === true) {
        this.trailerMid.progress = this.trailerMid.progress + 1;
        if (this.optionG2 === true) {
          var devs = {
            key: UUID.UUID(),
            date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
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
      if (this.optionH1 === true || this.optionH2 === true) {
        this.trailerMid.progress = this.trailerMid.progress + 1;
        if (this.optionH2 === true) {
          var devs = {
            key: UUID.UUID(),
            date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
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
      /*
      if (this.optionI1 === true || this.optionI2 === true) {
        this.trailerMid.progress = this.trailerMid.progress + 1;
      }
      */
      if (this.optionJ1 === true || this.optionJ2 === true) {
        this.trailerMid.progress = this.trailerMid.progress + 1;
        if (this.optionJ2 === true) {
          var devs = {
            key: UUID.UUID(),
            date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
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
      this.trailerMid.progress = this.trailerMid.progress / 10;
      this.afs.collection('inspections').doc(this.trailerMid.key).update(this.trailerMid);
      if (this.trailerMid.progress === 0) {
        var status = 'In Queue';
      } else if (this.trailerMid.progress > 0 && this.trailerMid.progress < 1) {
        var status = 'In Progress';
      } else if (this.trailerMid.progress === 1) {
        var status = 'Completed';
      }
      this.afs.collection('trailers').doc(this.trailerMid.trailerReg).update({
        workshopStatus: status,
        workshopProgress: this.trailerMid.progress,
        timeStamp: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD, HH:mm'),
        lastInspection: 'Workshop',
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
            date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
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
            date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
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
            date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
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
      if (this.optionD1 === true || this.optionD2 === true) {
        this.trailerLrg.progress = this.trailerLrg.progress + 1;
        if (this.optionD2 === true) {
          var devs = {
            key: UUID.UUID(),
            date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
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
            date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
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
            date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
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
            date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
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
      if (this.optionH1 === true || this.optionH2 === true) {
        this.trailerLrg.progress = this.trailerLrg.progress + 1;
        if (this.optionH2 === true) {
          var devs = {
            key: UUID.UUID(),
            date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
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
      if (this.optionI1 === true || this.optionI2 === true) {
        this.trailerLrg.progress = this.trailerLrg.progress + 1;
        if (this.optionI2 === true) {
          var devs = {
            key: UUID.UUID(),
            date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
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
      if (this.optionJ1 === true || this.optionJ2 === true) {
        this.trailerLrg.progress = this.trailerLrg.progress + 1;
        if (this.optionJ2 === true) {
          var devs = {
            key: UUID.UUID(),
            date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
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
      if (this.optionK1 === true || this.optionK2 === true) {
        this.trailerLrg.progress = this.trailerLrg.progress + 1;
        if (this.optionK2 === true) {
          var devs = {
            key: UUID.UUID(),
            date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
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
      if (this.optionL1 === true || this.optionL2 === true) {
        this.trailerLrg.progress = this.trailerLrg.progress + 1;
        if (this.optionL2 === true) {
          var devs = {
            key: UUID.UUID(),
            date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
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
      if (this.optionM1 === true || this.optionM2 === true) {
        this.trailerLrg.progress = this.trailerLrg.progress + 1;
        if (this.optionM2 === true) {
          var devs = {
            key: UUID.UUID(),
            date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
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
      if (this.optionN1 === true || this.optionN2 === true) {
        this.trailerLrg.progress = this.trailerLrg.progress + 1;
        if (this.optionN2 === true) {
          var devs = {
            key: UUID.UUID(),
            date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
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
      /*
      if (this.optionO1 === true || this.optionO2 === true) {
        this.trailerLrg.progress = this.trailerLrg.progress + 1;
      }
      */
      if (this.optionP1 === true || this.optionP2 === true) {
        this.trailerLrg.progress = this.trailerLrg.progress + 1;
        if (this.optionP2 === true) {
          var devs = {
            key: UUID.UUID(),
            date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
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
      if (this.optionQ1 === true || this.optionQ2 === true) {
        this.trailerLrg.progress = this.trailerLrg.progress + 1;
        if (this.optionQ2 === true) {
          var devs = {
            key: UUID.UUID(),
            date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
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
      if (this.optionR1 === true || this.optionR2 === true) {
        this.trailerLrg.progress = this.trailerLrg.progress + 1;
        if (this.optionR2 === true) {
          var devs = {
            key: UUID.UUID(),
            date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
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
      if (this.optionS1 === true || this.optionS2 === true) {
        this.trailerLrg.progress = this.trailerLrg.progress + 1;
        if (this.optionS2 === true) {
          var devs = {
            key: UUID.UUID(),
            date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
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
      if (this.optionT1 === true || this.optionT2 === true) {
        this.trailerLrg.progress = this.trailerLrg.progress + 1;
        if (this.optionT2 === true) {
          var devs = {
            key: UUID.UUID(),
            date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
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
      this.trailerLrg.progress = this.trailerLrg.progress / 20;
      this.afs.collection('inspections').doc(this.trailerLrg.key).update(this.trailerLrg);
      if (this.trailerLrg.progress === 0) {
        var status = 'In Queue';
      } else if (this.trailerLrg.progress > 0 && this.trailerLrg.progress < 1) {
        var status = 'In Progress';
      } else if (this.trailerLrg.progress === 1) {
        var status = 'Completed';
      }
      this.afs.collection('trailers').doc(this.trailerLrg.trailerReg).update({
        workshopStatus: status,
        workshopProgress: this.trailerLrg.progress,
        timeStamp: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD, HH:mm'),
        lastInspection: 'Workshop',
        lastInspectionTimestamp: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD, HH:mm'),
      });
    }
  }

  check() {
    if (this.checkType === 'Small') {

      /*
      if (this.optionA2 === true && this.deviations.note1 === '') {
        this.devMsg('Check tyres')
      }
      */
      if (this.optionB2 === true && this.deviations.note2 === '') {
        return this.devMsg('Listen for leaks')
      }
      if (this.optionC2 === true && this.deviations.note3 === '') {
        return this.devMsg('Check lights')
      }

      if (this.trailerSml.jobNo !== '') {
        //if (this.optionA1 === true || this.optionA2 === true) {
        if (this.optionB1 === true || this.optionB2 === true) {
          if (this.optionC1 === true || this.optionC2 === true) {
            if (this.trailerSml.controllerSig !== '') {
              return this.save()
            } else {
              this.alertMsg('Signature')
            }
          } else {
            this.alertMsg('Check lights')
          }
        } else {
          this.alertMsg('Listen for leaks')
        }
      } else {
        this.alertMsg('Job Card Number')
      }
    } else if (this.checkType === 'Medium') {

      if (this.optionA2 === true && this.deviations.note1 === '') {
        return this.devMsg('Check air pipes and listen for air leaks')
      }
      if (this.optionB2 === true && this.deviations.note2 === '') {
        return this.devMsg('Check spring packs/Airbags')
      }
      if (this.optionC2 === true && this.deviations.note3 === '') {
        return this.devMsg('Check bushes')
      }
      if (this.optionD2 === true && this.deviations.note4 === '') {
        return this.devMsg('Check Brakes')
      }
      if (this.optionE2 === true && this.deviations.note5 === '') {
        return this.devMsg('Adjust Brakes')
      }
      if (this.optionF2 === true && this.deviations.note6 === '') {
        return this.devMsg('Check 5th wheel engagement and locks')
      }
      if (this.optionG2 === true && this.deviations.note7 === '') {
        return this.devMsg('Check licence disc validity')
      }
      if (this.optionH2 === true && this.deviations.note8 === '') {
        return this.devMsg('Check hubs for leaks')
      }
      /*
      if (this.optionI2 === true && this.deviations.note9 === '') {
        this.devMsg('Check tyre wear')
      }
      */
      if (this.optionJ2 === true && this.deviations.note10 === '') {
        return this.devMsg('Check lights')
      }

      if (this.trailerMid.jobNo !== '') {
        if (this.optionA1 === true || this.optionA2 === true) {
          if (this.optionB1 === true || this.optionB2 === true) {
            if (this.optionC1 === true || this.optionC2 === true) {
              if (this.optionD1 === true || this.optionD2 === true) {
                if (this.optionE1 === true || this.optionE2 === true) {
                  if (this.optionF1 === true || this.optionF2 === true) {
                    if (this.optionG1 === true || this.optionG2 === true) {
                      if (this.optionH1 === true || this.optionH2 === true) {
                        // if (this.optionI1 === true || this.optionI2 === true) {
                        if (this.optionJ1 === true || this.optionJ2 === true) {
                          if (this.trailerMid.controllerSig !== '') {
                            return this.save()
                          } else {
                            this.alertMsg('Signature')
                          }
                        } else {
                          this.alertMsg('Check lights')
                        }
                        // } else {
                        //  this.alertMsg('Check tyre wear')
                        // }
                      } else {
                        this.alertMsg('Check hubs for leaks')
                      }
                    } else {
                      this.alertMsg('Check licence disc validity')
                    }
                  } else {
                    this.alertMsg('Check 5th wheel engagement and locks')
                  }
                } else {
                  this.alertMsg('Adjust Brakes')
                }
              } else {
                this.alertMsg('Check Brakes')
              }
            } else {
              this.alertMsg('Check bushes')
            }
          } else {
            this.alertMsg('Check spring packs/Airbags')
          }
        } else {
          this.alertMsg('Check air pipes and listen for air leaks')
        }
      } else {
        this.alertMsg('Job Card Number')
      }
    } else {

      if (this.optionA2 === true && this.deviations.note1 === '') {
        return this.devMsg('Check air pipe routing and listen for air leaks')
      }
      if (this.optionB2 === true && this.deviations.note2 === '') {
        return this.devMsg('Check suspension if secure (U-Bolts etc.)')
      }
      if (this.optionC2 === true && this.deviations.note3 === '') {
        return this.devMsg('Check torque arms, rocker boxes and bushes')
      }
      if (this.optionD2 === true && this.deviations.note4 === '') {
        return this.devMsg('Check spring packs/air bags and wear plates')
      }
      if (this.optionE2 === true && this.deviations.note5 === '') {
        return this.devMsg('Check axle seats for cracks')
      }
      if (this.optionF2 === true && this.deviations.note6 === '') {
        return this.devMsg('Check brake shoes/pads and state percentage of life used')
      }
      if (this.optionG2 === true && this.deviations.note7 === '') {
        return this.devMsg('Check booster and slack adjustors activation and travel')
      }
      if (this.optionH2 === true && this.deviations.note8 === '') {
        return this.devMsg('Check load sensor and level sensor rods')
      }
      if (this.optionI2 === true && this.deviations.note9 === '') {
        return this.devMsg('Adjust brakes and grease')
      }
      if (this.optionJ2 === true && this.deviations.note10 === '') {
        return this.devMsg('Check chassis for cracks and metal fatigue')
      }
      if (this.optionK2 === true && this.deviations.note11 === '') {
        return this.devMsg('Check chassis for cracks and excessive wear')
      }
      if (this.optionL2 === true && this.deviations.note12 === '') {
        return this.devMsg('Check 5th wheel engagement and locks')
      }
      if (this.optionM2 === true && this.deviations.note13 === '') {
        return this.devMsg('Check hubs for leaks')
      }
      if (this.optionN2 === true && this.deviations.note14 === '') {
        return this.devMsg('Check hubodometer')
      }
      /*
      if (this.optionO2 === true && this.deviations.note15 === '') {
        this.devMsg('Check tyre wear')
      }
      */
      if (this.optionP2 === true && this.deviations.note16 === '') {
        return this.devMsg('Check head board condition and if secure')
      }
      if (this.optionQ2 === true && this.deviations.note17 === '') {
        return this.devMsg('Check tail board condition and if secure')
      }
      if (this.optionR2 === true && this.deviations.note18 === '') {
        return this.devMsg('Check reflectors and warning signs')
      }
      if (this.optionS2 === true && this.deviations.note19 === '') {
        return this.devMsg('Check and attend to all reported defects')
      }
      if (this.optionT2 === true && this.deviations.note20 === '') {
        return this.devMsg('Check licence disc validity')
      }

      if (this.trailerLrg.jobNo !== '') {
        if (this.optionA1 === true || this.optionA2 === true) {
          if (this.optionB1 === true || this.optionB2 === true) {
            if (this.optionC1 === true || this.optionC2 === true) {
              if (this.optionD1 === true || this.optionD2 === true) {
                if (this.optionE1 === true || this.optionE2 === true) {
                  if (this.optionF1 === true || this.optionF2 === true) {
                    if (this.optionG1 === true || this.optionG2 === true) {
                      if (this.optionH1 === true || this.optionH2 === true) {
                        if (this.optionI1 === true || this.optionI2 === true) {
                          if (this.optionJ1 === true || this.optionJ2 === true) {
                            if (this.optionK1 === true || this.optionK2 === true) {
                              if (this.optionL1 === true || this.optionL2 === true) {
                                if (this.optionM1 === true || this.optionM2 === true) {
                                  if (this.optionN1 === true || this.optionN2 === true) {
                                    // if (this.optionO1 === true || this.optionO2 === true) {
                                    if (this.optionP1 === true || this.optionP2 === true) {
                                      if (this.optionQ1 === true || this.optionQ2 === true) {
                                        if (this.optionR1 === true || this.optionR2 === true) {
                                          if (this.optionS1 === true || this.optionS2 === true) {
                                            if (this.optionT1 === true || this.optionT2 === true) {
                                              if (this.trailerLrg.controllerSig !== '') {
                                                return this.save()
                                              } else {
                                                this.alertMsg('Signature')
                                              }
                                            } else {
                                              this.alertMsg('Check licence disc validity')
                                            }
                                          } else {
                                            this.alertMsg('Check and attend to all reported defects')
                                          }
                                        } else {
                                          this.alertMsg('Check reflectors and warning signs')
                                        }
                                      } else {
                                        this.alertMsg('Check tail board condition and if secure')
                                      }
                                    } else {
                                      this.alertMsg('Check head board condition and if secure')
                                    }
                                    // } else {
                                    // this.alertMsg('Check tyre wear')
                                    // }
                                  } else {
                                    this.alertMsg('Check hubodometer')
                                  }
                                } else {
                                  this.alertMsg('Check hubs for leaks')
                                }
                              } else {
                                this.alertMsg('Check 5th wheel engagement and locks')
                              }
                            } else {
                              this.alertMsg('Check chassis for cracks and excessive wear')
                            }
                          } else {
                            this.alertMsg('Check chassis for cracks and metal fatigue')
                          }
                        } else {
                          this.alertMsg('Adjust brakes and grease ')
                        }
                      } else {
                        this.alertMsg('Check load sensor and level sensor rods')
                      }
                    } else {
                      this.alertMsg('Check booster and slack adjustors activation and travel')
                    }
                  } else {
                    this.alertMsg('Check brake shoes/pads and state percentage of life used')
                  }
                } else {
                  this.alertMsg('Check axle seats for cracks')
                }
              } else {
                this.alertMsg('Check spring packs/air bags and wear plates')
              }
            } else {
              this.alertMsg('Check torque arms, rocker boxes and bushes')
            }
          } else {
            this.alertMsg('Check suspension if secure (U-Bolts etc.)')
          }
        } else {
          this.alertMsg('Check air pipe routing and listen for air leaks')
        }
      } else {
        this.alertMsg('Job Card Number')
      }
    }
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

  save() {
    this.saved = true;
    if (this.checkType === 'Small') {
      this.getDevSml();
      this.loading.present('Saving, Please wait...').then(() => {
        // Calculate time to complete inspection
        this.trailerSml.timeOut = moment(new Date().toISOString()).locale('en').format('HH:mm');
        this.trailerSml.duration = moment(this.trailerSml.timeOut, 'HH:mm').diff(moment(this.trailerSml.timeIn, 'HH:mm'), 'minutes', true);

        // Save inspection
        this.update();
        this.router.navigate(['home']);
        this.loading.dismiss();
      });
    } else if (this.checkType === 'Medium') {
      this.getDevMid();
      this.loading.present('Saving, Please wait...').then(() => {
        // Calculate time to complete inspection
        this.trailerMid.timeOut = moment(new Date().toISOString()).locale('en').format('HH:mm');
        this.trailerMid.duration = moment(this.trailerMid.timeOut, 'HH:mm').diff(moment(this.trailerMid.timeIn, 'HH:mm'), 'minutes', true);

        // Save inspection
        this.update();
        this.router.navigate(['home']);
        this.loading.dismiss();
      });
    } else {
      this.getDevLrg();
      this.loading.present('Saving, Please wait...').then(() => {
        // Calculate time to complete inspection
        this.trailerLrg.timeOut = moment(new Date().toISOString()).locale('en').format('HH:mm');
        this.trailerLrg.duration = moment(this.trailerLrg.timeOut, 'HH:mm').diff(moment(this.trailerLrg.timeIn, 'HH:mm'), 'minutes', true);

        // Save inspection
        this.update();
        this.router.navigate(['home']);
        this.loading.dismiss();
      });
    }
  }

  getDevSml() {
    // this.trailerSml.tyre = this.optionA1;
    this.trailerSml.leaks = this.optionB1;
    this.trailerSml.lights = this.optionC1;
    /*
    if (this.deviations.note1 !== '') {
      this.trailerSml.deviations.push({ item: 'Check tyres', note: this.deviations.note1, photo: this.deviations.photo1 })
    }
    */
    if (this.deviations.note2 !== '') {
      this.trailerSml.deviations.push({ item: 'Listen for leaks', note: this.deviations.note2, photo: this.deviations.photo2 })
    }
    if (this.deviations.note3 !== '') {
      this.trailerSml.deviations.push({ item: 'Check lights', note: this.deviations.note3, photo: this.deviations.photo3 })
    }
  }

  getDevMid() {
    this.trailerMid.air = this.optionA1;
    this.trailerMid.airbags = this.optionB1;
    this.trailerMid.bushes = this.optionC1;
    this.trailerMid.brakes = this.optionD1;
    this.trailerMid.adjust = this.optionE1;
    this.trailerMid.wheel = this.optionF1;
    this.trailerMid.licence = this.optionG1;
    this.trailerMid.hubs = this.optionH1;
    // this.trailerMid.wear = this.optionI1;
    this.trailerMid.lights = this.optionJ1;

    if (this.deviations.note1 !== '') {
      this.trailerMid.deviations.push({ item: 'Check air pipes and listen for air leaks', note: this.deviations.note1, photo: this.deviations.photo1 })
    }
    if (this.deviations.note2 !== '') {
      this.trailerMid.deviations.push({ item: 'Check spring packs/Airbags', note: this.deviations.note2, photo: this.deviations.photo2 })
    }
    if (this.deviations.note3 !== '') {
      this.trailerMid.deviations.push({ item: 'Check bushes', note: this.deviations.note3, photo: this.deviations.photo3 })
    }
    if (this.deviations.note4 !== '') {
      this.trailerMid.deviations.push({ item: 'Check Brakes', note: this.deviations.note4, photo: this.deviations.photo4 })
    }
    if (this.deviations.note5 !== '') {
      this.trailerMid.deviations.push({ item: 'Adjust Brakes', note: this.deviations.note5, photo: this.deviations.photo5 })
    }
    if (this.deviations.note6 !== '') {
      this.trailerMid.deviations.push({ item: 'Check 5th wheel engagement and locks', note: this.deviations.note6, photo: this.deviations.photo6 })
    }
    if (this.deviations.note7 !== '') {
      this.trailerMid.deviations.push({ item: 'Check licence disc validity', note: this.deviations.note7, photo: this.deviations.photo7 })
    }
    if (this.deviations.note8 !== '') {
      this.trailerMid.deviations.push({ item: 'Check hubs for leaks', note: this.deviations.note8, photo: this.deviations.photo8 })
    }
    /*
    if (this.deviations.note9 !== '') {
      this.trailerMid.deviations.push({ item: 'Check tyre wear', note: this.deviations.note9, photo: this.deviations.photo9 })
    }
    */
    if (this.deviations.note10 !== '') {
      this.trailerMid.deviations.push({ item: 'Check lights', note: this.deviations.note10, photo: this.deviations.photo10 })
    }
  }

  getDevLrg() {
    this.trailerLrg.air = this.optionA1;
    this.trailerLrg.suspension = this.optionB1;
    this.trailerLrg.torque = this.optionC1;
    this.trailerLrg.spring = this.optionD1;
    this.trailerLrg.axle = this.optionE1;
    this.trailerLrg.shoes = this.optionF1;
    this.trailerLrg.booster = this.optionG1;
    this.trailerLrg.sensor = this.optionH1;
    this.trailerLrg.brakes = this.optionI1;
    this.trailerLrg.chassis = this.optionJ1;
    this.trailerLrg.cracks = this.optionK1;
    this.trailerLrg.locks = this.optionL1;
    this.trailerLrg.hubs = this.optionM1;
    this.trailerLrg.hubodometer = this.optionN1;
    // this.trailerLrg.wear = this.optionO1;
    this.trailerLrg.headboard = this.optionP1;
    this.trailerLrg.tailboard = this.optionQ1;
    this.trailerLrg.reflectors = this.optionR1;
    this.trailerLrg.defects = this.optionS1;
    this.trailerLrg.licence = this.optionT1;

    if (this.deviations.note1 !== '') {
      this.trailerLrg.deviations.push({ item: 'Check air pipe routing and listen for air leaks', note: this.deviations.note1, photo: this.deviations.photo1 })
    }
    if (this.deviations.note2 !== '') {
      this.trailerLrg.deviations.push({ item: 'Check suspension if secure (U-Bolts etc.)', note: this.deviations.note2, photo: this.deviations.photo2 })
    }
    if (this.deviations.note3 !== '') {
      this.trailerLrg.deviations.push({ item: 'Check torque arms, rocker boxes and bushes', note: this.deviations.note3, photo: this.deviations.photo3 })
    }
    if (this.deviations.note4 !== '') {
      this.trailerLrg.deviations.push({ item: 'Check spring packs/air bags and wear plates', note: this.deviations.note4, photo: this.deviations.photo4 })
    }
    if (this.deviations.note5 !== '') {
      this.trailerLrg.deviations.push({ item: 'Check axle seats for cracks', note: this.deviations.note5, photo: this.deviations.photo5 })
    }
    if (this.deviations.note6 !== '') {
      this.trailerLrg.deviations.push({ item: 'Check brake shoes/pads and state percentage of life used', note: this.deviations.note6, photo: this.deviations.photo6 })
    }
    if (this.deviations.note7 !== '') {
      this.trailerLrg.deviations.push({ item: 'Check booster and slack adjustors activation and travel', note: this.deviations.note7, photo: this.deviations.photo7 })
    }
    if (this.deviations.note8 !== '') {
      this.trailerLrg.deviations.push({ item: 'Check load sensor and level sensor rods', note: this.deviations.note8, photo: this.deviations.photo8 })
    }
    if (this.deviations.note9 !== '') {
      this.trailerLrg.deviations.push({ item: 'Adjust brakes and grease', note: this.deviations.note9, photo: this.deviations.photo9 })
    }
    if (this.deviations.note10 !== '') {
      this.trailerLrg.deviations.push({ item: 'Check chassis for cracks and metal fatigue', note: this.deviations.note10, photo: this.deviations.photo10 })
    }
    if (this.deviations.note11 !== '') {
      this.trailerLrg.deviations.push({ item: 'Check chassis for cracks and excessive wear', note: this.deviations.note11, photo: this.deviations.photo11 })
    }
    if (this.deviations.note12 !== '') {
      this.trailerLrg.deviations.push({ item: 'Check 5th wheel engagement and locks', note: this.deviations.note12, photo: this.deviations.photo12 })
    }
    if (this.deviations.note13 !== '') {
      this.trailerLrg.deviations.push({ item: 'Check hubs for leaks', note: this.deviations.note13, photo: this.deviations.photo13 })
    }
    if (this.deviations.note14 !== '') {
      this.trailerLrg.deviations.push({ item: 'Check hubodometer', note: this.deviations.note14, photo: this.deviations.photo14 })
    }
    /*
    if (this.deviations.note15 !== '') {
      this.trailerLrg.deviations.push({ item: 'Check tyre wear', note: this.deviations.note15, photo: this.deviations.photo15 })
    }
    */
    if (this.deviations.note16 !== '') {
      this.trailerLrg.deviations.push({ item: 'Check head board condition and if secure', note: this.deviations.note16, photo: this.deviations.photo16 })
    }
    if (this.deviations.note17 !== '') {
      this.trailerLrg.deviations.push({ item: 'Check tail board condition and if secure', note: this.deviations.note17, photo: this.deviations.photo17 })
    }
    if (this.deviations.note18 !== '') {
      this.trailerLrg.deviations.push({ item: 'Check reflectors and warning signs', note: this.deviations.note18, photo: this.deviations.photo18 })
    }
    if (this.deviations.note19 !== '') {
      this.trailerLrg.deviations.push({ item: 'Check and attend to all reported defects', note: this.deviations.note19, photo: this.deviations.photo19 })
    }
    if (this.deviations.note20 !== '') {
      this.trailerLrg.deviations.push({ item: 'Check licence disc validity', note: this.deviations.note20, photo: this.deviations.photo20 })
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
        let photo = this.afStorage.ref(`deviation/workshop/${key}.jpeg`);

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
              } else if (unit === 'photo8') {
                this.deviations.photo8 = url;
              } else if (unit === 'photo9') {
                this.deviations.photo9 = url;
              } else if (unit === 'photo10') {
                this.deviations.photo10 = url;
              } else if (unit === 'photo11') {
                this.deviations.photo11 = url;
              } else if (unit === 'photo12') {
                this.deviations.photo12 = url;
              } else if (unit === 'photo13') {
                this.deviations.photo13 = url;
              } else if (unit === 'photo14') {
                this.deviations.photo14 = url;
              } else if (unit === 'photo15') {
                this.deviations.photo15 = url;
              } else if (unit === 'photo16') {
                this.deviations.photo16 = url;
              } else if (unit === 'photo17') {
                this.deviations.photo17 = url;
              } else if (unit === 'photo18') {
                this.deviations.photo18 = url;
              } else if (unit === 'photo19') {
                this.deviations.photo19 = url;
              } else if (unit === 'photo20') {
                this.deviations.photo20 = url;
              }
              this.loading.dismiss().then(() => {
                this.loadActive = false
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
    })
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

        const filePath = `deviation/workshop/${key}`;
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
                } else if (unit === 'photo8') {
                  this.deviations.photo8 = url;
                } else if (unit === 'photo9') {
                  this.deviations.photo9 = url;
                } else if (unit === 'photo10') {
                  this.deviations.photo10 = url;
                } else if (unit === 'photo11') {
                  this.deviations.photo11 = url;
                } else if (unit === 'photo12') {
                  this.deviations.photo12 = url;
                } else if (unit === 'photo13') {
                  this.deviations.photo13 = url;
                } else if (unit === 'photo14') {
                  this.deviations.photo14 = url;
                } else if (unit === 'photo15') {
                  this.deviations.photo15 = url;
                } else if (unit === 'photo16') {
                  this.deviations.photo16 = url;
                } else if (unit === 'photo17') {
                  this.deviations.photo17 = url;
                } else if (unit === 'photo18') {
                  this.deviations.photo18 = url;
                } else if (unit === 'photo19') {
                  this.deviations.photo19 = url;
                } else if (unit === 'photo20') {
                  this.deviations.photo20 = url;
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
    } else if (unit === 'photo8') {
      this.deviations.photo8 = '';
    } else if (unit === 'photo9') {
      this.deviations.photo9 = '';
    } else if (unit === 'photo10') {
      this.deviations.photo10 = '';
    } else if (unit === 'photo11') {
      this.deviations.photo11 = '';
    } else if (unit === 'photo12') {
      this.deviations.photo12 = '';
    } else if (unit === 'photo13') {
      this.deviations.photo13 = '';
    } else if (unit === 'photo14') {
      this.deviations.photo14 = '';
    } else if (unit === 'photo15') {
      this.deviations.photo15 = '';
    } else if (unit === 'photo16') {
      this.deviations.photo16 = '';
    } else if (unit === 'photo17') {
      this.deviations.photo17 = '';
    } else if (unit === 'photo18') {
      this.deviations.photo18 = '';
    } else if (unit === 'photo19') {
      this.deviations.photo19 = '';
    } else if (unit === 'photo20') {
      this.deviations.photo20 = '';
    }
  }

  ngOnDestroy() {
    if (this.saved === true) {
    } else {
      if (this.checkType === 'Small') {
        this.afs.collection('inspections').doc(this.trailerSml.key).delete();
      } else if (this.checkType === 'Medium') {
        this.afs.collection('inspections').doc(this.trailerMid.key).delete();
      } else if (this.checkType === 'Large') {
        this.afs.collection('inspections').doc(this.trailerLrg.key).delete();
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
  changeH1() {
    if (this.optionH1 === false) {
      this.optionH2 = true;
    } else {
      this.optionH2 = false;
    }
    this.update();
  }
  changeH2() {
    if (this.optionH2 === false) {
      this.optionH1 = true;
    } else {
      this.optionH1 = false;
    }
    this.update();
  }
  changeI1() {
    if (this.optionI1 === false) {
      this.optionI2 = true;
    } else {
      this.optionI2 = false;
    }
    this.update();
  }
  changeI2() {
    if (this.optionI2 === false) {
      this.optionI1 = true;
    } else {
      this.optionI1 = false;
    }
    this.update();
  }
  changeJ1() {
    if (this.optionJ1 === false) {
      this.optionJ2 = true;
    } else {
      this.optionJ2 = false;
    }
    this.update();
  }
  changeJ2() {
    if (this.optionJ2 === false) {
      this.optionJ1 = true;
    } else {
      this.optionJ1 = false;
    }
    this.update();
  }
  changeK1() {
    if (this.optionK1 === false) {
      this.optionK2 = true;
    } else {
      this.optionK2 = false;
    }
    this.update();
  }
  changeK2() {
    if (this.optionK2 === false) {
      this.optionK1 = true;
    } else {
      this.optionK1 = false;
    }
    this.update();
  }
  changeL1() {
    if (this.optionL1 === false) {
      this.optionL2 = true;
    } else {
      this.optionL2 = false;
    }
    this.update();
  }
  changeL2() {
    if (this.optionL2 === false) {
      this.optionL1 = true;
    } else {
      this.optionL1 = false;
    }
    this.update();
  }
  changeM1() {
    if (this.optionM1 === false) {
      this.optionM2 = true;
    } else {
      this.optionM2 = false;
    }
    this.update();
  }
  changeM2() {
    if (this.optionM2 === false) {
      this.optionM1 = true;
    } else {
      this.optionM1 = false;
    }
    this.update();
  }
  changeN1() {
    if (this.optionN1 === false) {
      this.optionN2 = true;
    } else {
      this.optionN2 = false;
    }
    this.update();
  }
  changeN2() {
    if (this.optionN2 === false) {
      this.optionN1 = true;
    } else {
      this.optionN1 = false;
    }
    this.update();
  }
  changeO1() {
    if (this.optionO1 === false) {
      this.optionO2 = true;
    } else {
      this.optionO2 = false;
    }
    this.update();
  }
  changeO2() {
    if (this.optionO2 === false) {
      this.optionO1 = true;
    } else {
      this.optionO1 = false;
    }
    this.update();
  }

  changeP1() {
    if (this.optionP1 === false) {
      this.optionP2 = true;
    } else {
      this.optionP2 = false;
    }
    this.update();
  }
  changeP2() {
    if (this.optionP2 === false) {
      this.optionP1 = true;
    } else {
      this.optionP1 = false;
    }
    this.update();
  }

  changeQ1() {
    if (this.optionQ1 === false) {
      this.optionQ2 = true;
    } else {
      this.optionQ2 = false;
    }
    this.update();
  }
  changeQ2() {
    if (this.optionQ2 === false) {
      this.optionQ1 = true;
    } else {
      this.optionQ1 = false;
    }
    this.update();
  }

  changeR1() {
    if (this.optionR1 === false) {
      this.optionR2 = true;
    } else {
      this.optionR2 = false;
    }
    this.update();
  }
  changeR2() {
    if (this.optionR2 === false) {
      this.optionR1 = true;
    } else {
      this.optionR1 = false;
    }
    this.update();
  }

  changeS1() {
    if (this.optionS1 === false) {
      this.optionS2 = true;
    } else {
      this.optionS2 = false;
    }
    this.update();
  }
  changeS2() {
    if (this.optionS2 === false) {
      this.optionS1 = true;
    } else {
      this.optionS1 = false;
    }
    this.update();
  }

  changeT1() {
    if (this.optionT1 === false) {
      this.optionT2 = true;
    } else {
      this.optionT2 = false;
    }
    this.update();
  }
  changeT2() {
    if (this.optionT2 === false) {
      this.optionT1 = true;
    } else {
      this.optionT1 = false;
    }
    this.update();
  }

}

