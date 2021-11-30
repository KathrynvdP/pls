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
  selector: 'app-workshop-truck',
  templateUrl: './workshop-truck.page.html',
  styleUrls: ['./workshop-truck.page.scss'],
})
export class WorkshopTruckPage implements OnInit {

  saved = false;
  code;
  type;
  checkType;

  truckSml = {
    type: 'workshop', report: 'Workshop Check', key: '', code: '', date: '', timeIn: '', timeOut: '', duration: {}, truckReg: '', truckFleet: '', truckFleetNo: '', checkType: '', jobNo: '',
    oil: false, coolant: false, lights: false, progress: 0, deviations: [],
    controller: '', controllerSig: '',
  };

  truckMid = {
    type: 'workshop', report: 'Workshop Check', key: '', code: '', date: '', timeIn: '', timeOut: '', duration: {}, truckReg: '', truckFleet: '', truckFleetNo: '', checkType: '', jobNo: '',
    engine: false, gearbox: false, propshafts: false, airbags: false, brakes: false,
    coolant: false, windscreen: false, licence: false, defects: false, lights: false, notes: '', progress: 0, deviations: [],
    controller: '', controllerSig: '',
  };

  truckLrg = {
    type: 'workshop', report: 'Workshop Check', key: '', code: '', date: '', timeIn: '', timeOut: '', duration: {}, truckReg: '', truckFleet: '', truckFleetNo: '', checkType: '', jobNo: '',
    radiator: false, engine: false, bellhousing: false, gearbox: false, propshafts: false, suspension: false,
    tyre: false, airbags: false, brakes: false, diffs: false,
    extOil: false, extCoolant: false, fluid: false, windscreen: false, licence: false, defects: false, lights: false,
    reflectors: false, battery: false, chevron: false, notes: '', progress: 0, deviations: [],
    controller: '', controllerSig: '',
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

  //isDrawing1 = true;
  isDrawing2 = true;
  //isDrawing3 = true;

  signaturePadOptions: Object = {
    minWidth: 2,
    backgroundColor: '#fff',
    penColor: '#000',
    canvasWidth: 250
  };

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

  editMode;

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
    this.editMode = this.activatedRoute.snapshot.paramMap.get('edit');
    this.afs.collection('trucks').doc(this.code).ref.get().then(truck => {
      if (this.editMode !== true) {
        this.startInspection(truck);
      } else {
        this.collectInspection(truck);
      }
    });
  }

  collectInspection(truck) {
    this.afs.collection('inspections').ref.where('code', '==', truck.code).where('jobNo', '==', truck.jobNo).where('type', '==', 'workshop').limit(1).get().then(docs => {
      docs.forEach((doc: any) => {
        if (doc.data().checkType === 'Small') {
          this.truckSml = doc.data();
        } else if (doc.data().checkType === 'Medium') {
          this.truckMid = doc.data();
        } else {
          this.truckLrg = doc.data();
        }
      })
    })
  }

  startInspection(truck) {
    if (this.checkType === 'Small') {
      this.truckSml.code = this.code;
      this.truckSml.checkType = this.checkType;
      this.truckSml.truckReg = truck.data().registration;
      this.truckSml.truckFleet = truck.data().fleet;
      this.truckSml.truckFleetNo = truck.data().fleetNo;
      this.truckSml.jobNo = truck.data().jobNo
      this.truckSml.date = moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD');
      this.truckSml.timeIn = moment(new Date().toISOString()).locale('en').format('HH:mm');
      this.truckSml.key = UUID.UUID();
      this.afs.collection('inspections').doc(this.truckSml.key).set(this.truckSml);
    } else if (this.checkType === 'Medium') {
      this.truckMid.code = this.code;
      this.truckMid.checkType = this.checkType;
      this.truckMid.truckReg = truck.data().registration;
      this.truckMid.truckFleet = truck.data().fleet;
      this.truckMid.truckFleetNo = truck.data().fleetNo;
      this.truckMid.jobNo = truck.data().jobNo
      this.truckMid.date = moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD');
      this.truckMid.timeIn = moment(new Date().toISOString()).locale('en').format('HH:mm');
      this.truckMid.key = UUID.UUID();
      this.afs.collection('inspections').doc(this.truckMid.key).set(this.truckMid);
    } else {
      this.truckLrg.code = this.code;
      this.truckLrg.checkType = this.checkType;
      this.truckLrg.truckReg = truck.data().registration;
      this.truckLrg.truckFleet = truck.data().fleet;
      this.truckLrg.truckFleetNo = truck.data().fleetNo;
      this.truckLrg.jobNo = truck.data().jobNo
      this.truckLrg.date = moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD');
      this.truckLrg.timeIn = moment(new Date().toISOString()).locale('en').format('HH:mm');
      this.truckLrg.key = UUID.UUID();
      this.afs.collection('inspections').doc(this.truckLrg.key).set(this.truckLrg);
    }
    this.getUser();
  }

  getUser() {
    this.storage.get('user').then(user => {
      if (this.checkType === 'Small') {
        this.truckSml.controller = user.name
      } else if (this.checkType === 'Medium') {
        this.truckMid.controller = user.name
      } else {
        this.truckLrg.controller = user.name
      }
    })
  }

  drawStart2() {
    this.isDrawing2 = true;
  }

  drawComplete2() {
    this.isDrawing2 = false;
    if (this.checkType === 'Small') {
      this.truckSml.controllerSig = this.sigPad2.toDataURL();
    } else if (this.checkType === 'Medium') {
      this.truckMid.controllerSig = this.sigPad2.toDataURL();
    } else {
      this.truckLrg.controllerSig = this.sigPad2.toDataURL();
    }
  }

  clearPad2() {
    this.sigPad2.clear();
    if (this.checkType === 'Small') {
      this.truckSml.controllerSig = '';
    } else if (this.checkType === 'Medium') {
      this.truckMid.controllerSig = '';
    } else {
      this.truckLrg.controllerSig = '';
    }
  }

  update() {
    if (this.checkType === 'Small') {
      this.truckSml.progress = 0;
      if (this.truckSml.jobNo !== '') {
        this.truckSml.progress = this.truckSml.progress + 1;
      }
      if (this.optionA1 === true || this.optionA2 === true) {
        this.truckSml.progress = this.truckSml.progress + 1;
        if (this.optionA2 === true) {
          var devs = {
            key: UUID.UUID(),
            date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
            time: moment(new Date().toISOString()).locale('en').format('HH:mm'),
            code: this.truckSml.truckReg,
            fleet: this.truckSml.truckFleet,
            fleetNo: this.truckSml.truckFleetNo,
            status: 'Pending',
            inspection: this.truckSml.type
          };
          this.afs.collection('deviations').doc(devs.key).set(devs);
        }
      }
      if (this.optionB1 === true || this.optionB2 === true) {
        this.truckSml.progress = this.truckSml.progress + 1;
        if (this.optionB2 === true) {
          var devs = {
            key: UUID.UUID(),
            date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
            time: moment(new Date().toISOString()).locale('en').format('HH:mm'),
            code: this.truckSml.truckReg,
            fleet: this.truckSml.truckFleet,
            fleetNo: this.truckSml.truckFleetNo,
            status: 'Pending',
            inspection: this.truckSml.type
          };
          this.afs.collection('deviations').doc(devs.key).set(devs);
        }
      }
      if (this.optionC1 === true || this.optionC2 === true) {
        this.truckSml.progress = this.truckSml.progress + 1;
        if (this.optionC2 === true) {
          var devs = {
            key: UUID.UUID(),
            date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
            time: moment(new Date().toISOString()).locale('en').format('HH:mm'),
            code: this.truckSml.truckReg,
            fleet: this.truckSml.truckFleet,
            fleetNo: this.truckSml.truckFleetNo,
            status: 'Pending',
            inspection: this.truckSml.type
          };
          this.afs.collection('deviations').doc(devs.key).set(devs);
        }
      }
      this.truckSml.progress = this.truckSml.progress / 4;
      this.afs.collection('inspections').doc(this.truckSml.key).update(this.truckSml);
      if (this.truckSml.progress === 0) {
        var status = 'In Queue';
      } else if (this.truckSml.progress > 0 && this.truckSml.progress < 1) {
        var status = 'In Progress';
      } else if (this.truckSml.progress === 1) {
        var status = 'Completed';
      }
      this.afs.collection('trucks').doc(this.truckSml.truckReg).update({
        workshopStatus: status,
        workshopProgress: this.truckSml.progress,
        timeStamp: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD, HH:mm'),
        lastInspection: 'Workshop',
        lastInspectionTimestamp: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD, HH:mm'),
      });
    } else if (this.checkType === 'Medium') {
      this.truckMid.progress = 0;
      if (this.truckMid.jobNo !== '') {
        this.truckMid.progress = this.truckMid.progress + 1;
      }
      if (this.optionA1 === true || this.optionA2 === true) {
        this.truckMid.progress = this.truckMid.progress + 1;
        if (this.optionA2 === true) {
          var devs = {
            key: UUID.UUID(),
            date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
            time: moment(new Date().toISOString()).locale('en').format('HH:mm'),
            code: this.truckMid.truckReg,
            fleet: this.truckMid.truckFleet,
            fleetNo: this.truckMid.truckFleetNo,
            status: 'Pending',
            inspection: this.truckMid.type
          };
          this.afs.collection('deviations').doc(devs.key).set(devs);
        }
      }
      if (this.optionB1 === true || this.optionB2 === true) {
        this.truckMid.progress = this.truckMid.progress + 1;
        if (this.optionB2 === true) {
          var devs = {
            key: UUID.UUID(),
            date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
            time: moment(new Date().toISOString()).locale('en').format('HH:mm'),
            code: this.truckMid.truckReg,
            fleet: this.truckMid.truckFleet,
            fleetNo: this.truckMid.truckFleetNo,
            status: 'Pending',
            inspection: this.truckMid.type
          };
          this.afs.collection('deviations').doc(devs.key).set(devs);
        }
      }
      if (this.optionC1 === true || this.optionC2 === true) {
        this.truckMid.progress = this.truckMid.progress + 1;
        if (this.optionC2 === true) {
          var devs = {
            key: UUID.UUID(),
            date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
            time: moment(new Date().toISOString()).locale('en').format('HH:mm'),
            code: this.truckMid.truckReg,
            fleet: this.truckMid.truckFleet,
            fleetNo: this.truckMid.truckFleetNo,
            status: 'Pending',
            inspection: this.truckMid.type
          };
          this.afs.collection('deviations').doc(devs.key).set(devs);
        }
      }
      if (this.optionD1 === true || this.optionD2 === true) {
        this.truckMid.progress = this.truckMid.progress + 1;
        if (this.optionD2 === true) {
          var devs = {
            key: UUID.UUID(),
            date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
            time: moment(new Date().toISOString()).locale('en').format('HH:mm'),
            code: this.truckMid.truckReg,
            fleet: this.truckMid.truckFleet,
            fleetNo: this.truckMid.truckFleetNo,
            status: 'Pending',
            inspection: this.truckMid.type
          };
          this.afs.collection('deviations').doc(devs.key).set(devs);
        }
      }
      if (this.optionE1 === true || this.optionE2 === true) {
        this.truckMid.progress = this.truckMid.progress + 1;
        if (this.optionE2 === true) {
          var devs = {
            key: UUID.UUID(),
            date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
            time: moment(new Date().toISOString()).locale('en').format('HH:mm'),
            code: this.truckMid.truckReg,
            fleet: this.truckMid.truckFleet,
            fleetNo: this.truckMid.truckFleetNo,
            status: 'Pending',
            inspection: this.truckMid.type
          };
          this.afs.collection('deviations').doc(devs.key).set(devs);
        }
      }
      if (this.optionF1 === true || this.optionF2 === true) {
        this.truckMid.progress = this.truckMid.progress + 1;
        if (this.optionF2 === true) {
          var devs = {
            key: UUID.UUID(),
            date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
            time: moment(new Date().toISOString()).locale('en').format('HH:mm'),
            code: this.truckMid.truckReg,
            fleet: this.truckMid.truckFleet,
            fleetNo: this.truckMid.truckFleetNo,
            status: 'Pending',
            inspection: this.truckMid.type
          };
          this.afs.collection('deviations').doc(devs.key).set(devs);
        }
      }
      if (this.optionG1 === true || this.optionG2 === true) {
        this.truckMid.progress = this.truckMid.progress + 1;
        if (this.optionG2 === true) {
          var devs = {
            key: UUID.UUID(),
            date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
            time: moment(new Date().toISOString()).locale('en').format('HH:mm'),
            code: this.truckMid.truckReg,
            fleet: this.truckMid.truckFleet,
            fleetNo: this.truckMid.truckFleetNo,
            status: 'Pending',
            inspection: this.truckMid.type
          };
          this.afs.collection('deviations').doc(devs.key).set(devs);
        }
      }
      if (this.optionH1 === true || this.optionH2 === true) {
        this.truckMid.progress = this.truckMid.progress + 1;
        if (this.optionH2 === true) {
          var devs = {
            key: UUID.UUID(),
            date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
            time: moment(new Date().toISOString()).locale('en').format('HH:mm'),
            code: this.truckMid.truckReg,
            fleet: this.truckMid.truckFleet,
            fleetNo: this.truckMid.truckFleetNo,
            status: 'Pending',
            inspection: this.truckMid.type
          };
          this.afs.collection('deviations').doc(devs.key).set(devs);
        }
      }
      if (this.optionI1 === true || this.optionI2 === true) {
        this.truckMid.progress = this.truckMid.progress + 1;
        if (this.optionI2 === true) {
          var devs = {
            key: UUID.UUID(),
            date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
            time: moment(new Date().toISOString()).locale('en').format('HH:mm'),
            code: this.truckMid.truckReg,
            fleet: this.truckMid.truckFleet,
            fleetNo: this.truckMid.truckFleetNo,
            status: 'Pending',
            inspection: this.truckMid.type
          };
          this.afs.collection('deviations').doc(devs.key).set(devs);
        }
      }
      if (this.optionJ1 === true || this.optionJ2 === true) {
        this.truckMid.progress = this.truckMid.progress + 1;
        if (this.optionJ2 === true) {
          var devs = {
            key: UUID.UUID(),
            date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
            time: moment(new Date().toISOString()).locale('en').format('HH:mm'),
            code: this.truckMid.truckReg,
            fleet: this.truckMid.truckFleet,
            fleetNo: this.truckMid.truckFleetNo,
            status: 'Pending',
            inspection: this.truckMid.type
          };
          this.afs.collection('deviations').doc(devs.key).set(devs);
        }
      }
      this.truckMid.progress = this.truckMid.progress / 11;
      this.afs.collection('inspections').doc(this.truckMid.key).update(this.truckMid);
      if (this.truckMid.progress === 0) {
        var status = 'In Queue';
      } else if (this.truckMid.progress > 0 && this.truckMid.progress < 1) {
        var status = 'In Progress';
      } else if (this.truckMid.progress === 1) {
        var status = 'Completed';
      }
      this.afs.collection('trucks').doc(this.truckMid.truckReg).update({
        workshopStatus: status,
        workshopProgress: this.truckMid.progress,
        timeStamp: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD, HH:mm'),
        lastInspection: 'Workshop',
        lastInspectionTimestamp: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD, HH:mm'),
      });
    } else {
      this.truckLrg.progress = 0;
      if (this.truckLrg.jobNo !== '') {
        this.truckLrg.progress = this.truckLrg.progress + 1;
      }
      if (this.optionA1 === true || this.optionA2 === true) {
        this.truckLrg.progress = this.truckLrg.progress + 1;
        if (this.optionA2 === true) {
          var devs = {
            key: UUID.UUID(),
            date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
            time: moment(new Date().toISOString()).locale('en').format('HH:mm'),
            code: this.truckLrg.truckReg,
            fleet: this.truckLrg.truckFleet,
            fleetNo: this.truckLrg.truckFleetNo,
            status: 'Pending',
            inspection: this.truckLrg.type
          };
          this.afs.collection('deviations').doc(devs.key).set(devs);
        }
      }
      if (this.optionB1 === true || this.optionB2 === true) {
        this.truckLrg.progress = this.truckLrg.progress + 1;
        if (this.optionB2 === true) {
          var devs = {
            key: UUID.UUID(),
            date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
            time: moment(new Date().toISOString()).locale('en').format('HH:mm'),
            code: this.truckLrg.truckReg,
            fleet: this.truckLrg.truckFleet,
            fleetNo: this.truckLrg.truckFleetNo,
            status: 'Pending',
            inspection: this.truckLrg.type
          };
          this.afs.collection('deviations').doc(devs.key).set(devs);
        }
      }
      if (this.optionC1 === true || this.optionC2 === true) {
        this.truckLrg.progress = this.truckLrg.progress + 1;
        if (this.optionC2 === true) {
          var devs = {
            key: UUID.UUID(),
            date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
            time: moment(new Date().toISOString()).locale('en').format('HH:mm'),
            code: this.truckLrg.truckReg,
            fleet: this.truckLrg.truckFleet,
            fleetNo: this.truckLrg.truckFleetNo,
            status: 'Pending',
            inspection: this.truckLrg.type
          };
          this.afs.collection('deviations').doc(devs.key).set(devs);
        }
      }
      if (this.optionD1 === true || this.optionD2 === true) {
        this.truckLrg.progress = this.truckLrg.progress + 1;
        if (this.optionD2 === true) {
          var devs = {
            key: UUID.UUID(),
            date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
            time: moment(new Date().toISOString()).locale('en').format('HH:mm'),
            code: this.truckLrg.truckReg,
            fleet: this.truckLrg.truckFleet,
            fleetNo: this.truckLrg.truckFleetNo,
            status: 'Pending',
            inspection: this.truckLrg.type
          };
          this.afs.collection('deviations').doc(devs.key).set(devs);
        }
      }
      if (this.optionE1 === true || this.optionE2 === true) {
        this.truckLrg.progress = this.truckLrg.progress + 1;
        if (this.optionE2 === true) {
          var devs = {
            key: UUID.UUID(),
            date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
            time: moment(new Date().toISOString()).locale('en').format('HH:mm'),
            code: this.truckLrg.truckReg,
            fleet: this.truckLrg.truckFleet,
            fleetNo: this.truckLrg.truckFleetNo,
            status: 'Pending',
            inspection: this.truckLrg.type
          };
          this.afs.collection('deviations').doc(devs.key).set(devs);
        }
      }
      if (this.optionF1 === true || this.optionF2 === true) {
        this.truckLrg.progress = this.truckLrg.progress + 1;
        if (this.optionF2 === true) {
          var devs = {
            key: UUID.UUID(),
            date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
            time: moment(new Date().toISOString()).locale('en').format('HH:mm'),
            code: this.truckLrg.truckReg,
            fleet: this.truckLrg.truckFleet,
            fleetNo: this.truckLrg.truckFleetNo,
            status: 'Pending',
            inspection: this.truckLrg.type
          };
          this.afs.collection('deviations').doc(devs.key).set(devs);
        }
      }
      if (this.optionG1 === true || this.optionG2 === true) {
        this.truckLrg.progress = this.truckLrg.progress + 1;
        if (this.optionG2 === true) {
          var devs = {
            key: UUID.UUID(),
            date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
            time: moment(new Date().toISOString()).locale('en').format('HH:mm'),
            code: this.truckLrg.truckReg,
            fleet: this.truckLrg.truckFleet,
            fleetNo: this.truckLrg.truckFleetNo,
            status: 'Pending',
            inspection: this.truckLrg.type
          };
          this.afs.collection('deviations').doc(devs.key).set(devs);
        }
      }
      if (this.optionH1 === true || this.optionH2 === true) {
        this.truckLrg.progress = this.truckLrg.progress + 1;
        if (this.optionH2 === true) {
          var devs = {
            key: UUID.UUID(),
            date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
            time: moment(new Date().toISOString()).locale('en').format('HH:mm'),
            code: this.truckLrg.truckReg,
            fleet: this.truckLrg.truckFleet,
            fleetNo: this.truckLrg.truckFleetNo,
            status: 'Pending',
            inspection: this.truckLrg.type
          };
          this.afs.collection('deviations').doc(devs.key).set(devs);
        }
      }
      if (this.optionI1 === true || this.optionI2 === true) {
        this.truckLrg.progress = this.truckLrg.progress + 1;
        if (this.optionI2 === true) {
          var devs = {
            key: UUID.UUID(),
            date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
            time: moment(new Date().toISOString()).locale('en').format('HH:mm'),
            code: this.truckLrg.truckReg,
            fleet: this.truckLrg.truckFleet,
            fleetNo: this.truckLrg.truckFleetNo,
            status: 'Pending',
            inspection: this.truckLrg.type
          };
          this.afs.collection('deviations').doc(devs.key).set(devs);
        }
      }
      if (this.optionJ1 === true || this.optionJ2 === true) {
        this.truckLrg.progress = this.truckLrg.progress + 1;
        if (this.optionJ2 === true) {
          var devs = {
            key: UUID.UUID(),
            date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
            time: moment(new Date().toISOString()).locale('en').format('HH:mm'),
            code: this.truckLrg.truckReg,
            fleet: this.truckLrg.truckFleet,
            fleetNo: this.truckLrg.truckFleetNo,
            status: 'Pending',
            inspection: this.truckLrg.type
          };
          this.afs.collection('deviations').doc(devs.key).set(devs);
        }
      }
      if (this.optionK1 === true || this.optionK2 === true) {
        this.truckLrg.progress = this.truckLrg.progress + 1;
        if (this.optionK2 === true) {
          var devs = {
            key: UUID.UUID(),
            date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
            time: moment(new Date().toISOString()).locale('en').format('HH:mm'),
            code: this.truckLrg.truckReg,
            fleet: this.truckLrg.truckFleet,
            fleetNo: this.truckLrg.truckFleetNo,
            status: 'Pending',
            inspection: this.truckLrg.type
          };
          this.afs.collection('deviations').doc(devs.key).set(devs);
        }
      }
      if (this.optionL1 === true || this.optionL2 === true) {
        this.truckLrg.progress = this.truckLrg.progress + 1;
        if (this.optionL2 === true) {
          var devs = {
            key: UUID.UUID(),
            date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
            time: moment(new Date().toISOString()).locale('en').format('HH:mm'),
            code: this.truckLrg.truckReg,
            fleet: this.truckLrg.truckFleet,
            fleetNo: this.truckLrg.truckFleetNo,
            status: 'Pending',
            inspection: this.truckLrg.type
          };
          this.afs.collection('deviations').doc(devs.key).set(devs);
        }
      }
      if (this.optionM1 === true || this.optionM2 === true) {
        this.truckLrg.progress = this.truckLrg.progress + 1;
        if (this.optionM2 === true) {
          var devs = {
            key: UUID.UUID(),
            date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
            time: moment(new Date().toISOString()).locale('en').format('HH:mm'),
            code: this.truckLrg.truckReg,
            fleet: this.truckLrg.truckFleet,
            fleetNo: this.truckLrg.truckFleetNo,
            status: 'Pending',
            inspection: this.truckLrg.type
          };
          this.afs.collection('deviations').doc(devs.key).set(devs);
        }
      }
      if (this.optionN1 === true || this.optionN2 === true) {
        this.truckLrg.progress = this.truckLrg.progress + 1;
        if (this.optionN2 === true) {
          var devs = {
            key: UUID.UUID(),
            date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
            time: moment(new Date().toISOString()).locale('en').format('HH:mm'),
            code: this.truckLrg.truckReg,
            fleet: this.truckLrg.truckFleet,
            fleetNo: this.truckLrg.truckFleetNo,
            status: 'Pending',
            inspection: this.truckLrg.type
          };
          this.afs.collection('deviations').doc(devs.key).set(devs);
        }
      }
      if (this.optionO1 === true || this.optionO2 === true) {
        this.truckLrg.progress = this.truckLrg.progress + 1;
        if (this.optionO2 === true) {
          var devs = {
            key: UUID.UUID(),
            date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
            time: moment(new Date().toISOString()).locale('en').format('HH:mm'),
            code: this.truckLrg.truckReg,
            fleet: this.truckLrg.truckFleet,
            fleetNo: this.truckLrg.truckFleetNo,
            status: 'Pending',
            inspection: this.truckLrg.type
          };
          this.afs.collection('deviations').doc(devs.key).set(devs);
        }
      }
      if (this.optionP1 === true || this.optionP2 === true) {
        this.truckLrg.progress = this.truckLrg.progress + 1;
        if (this.optionP2 === true) {
          var devs = {
            key: UUID.UUID(),
            date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
            time: moment(new Date().toISOString()).locale('en').format('HH:mm'),
            code: this.truckLrg.truckReg,
            fleet: this.truckLrg.truckFleet,
            fleetNo: this.truckLrg.truckFleetNo,
            status: 'Pending',
            inspection: this.truckLrg.type
          };
          this.afs.collection('deviations').doc(devs.key).set(devs);
        }
      }
      if (this.optionQ1 === true || this.optionQ2 === true) {
        this.truckLrg.progress = this.truckLrg.progress + 1;
        if (this.optionQ2 === true) {
          var devs = {
            key: UUID.UUID(),
            date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
            time: moment(new Date().toISOString()).locale('en').format('HH:mm'),
            code: this.truckLrg.truckReg,
            fleet: this.truckLrg.truckFleet,
            fleetNo: this.truckLrg.truckFleetNo,
            status: 'Pending',
            inspection: this.truckLrg.type
          };
          this.afs.collection('deviations').doc(devs.key).set(devs);
        }
      }
      if (this.optionR1 === true || this.optionR2 === true) {
        this.truckLrg.progress = this.truckLrg.progress + 1;
        if (this.optionR2 === true) {
          var devs = {
            key: UUID.UUID(),
            date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
            time: moment(new Date().toISOString()).locale('en').format('HH:mm'),
            code: this.truckLrg.truckReg,
            fleet: this.truckLrg.truckFleet,
            fleetNo: this.truckLrg.truckFleetNo,
            status: 'Pending',
            inspection: this.truckLrg.type
          };
          this.afs.collection('deviations').doc(devs.key).set(devs);
        }
      }
      if (this.optionS1 === true || this.optionS2 === true) {
        this.truckLrg.progress = this.truckLrg.progress + 1;
        if (this.optionS2 === true) {
          var devs = {
            key: UUID.UUID(),
            date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
            time: moment(new Date().toISOString()).locale('en').format('HH:mm'),
            code: this.truckLrg.truckReg,
            fleet: this.truckLrg.truckFleet,
            fleetNo: this.truckLrg.truckFleetNo,
            status: 'Pending',
            inspection: this.truckLrg.type
          };
          this.afs.collection('deviations').doc(devs.key).set(devs);
        }
      }
      if (this.optionT1 === true || this.optionT2 === true) {
        this.truckLrg.progress = this.truckLrg.progress + 1;
        if (this.optionT2 === true) {
          var devs = {
            key: UUID.UUID(),
            date: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD'),
            time: moment(new Date().toISOString()).locale('en').format('HH:mm'),
            code: this.truckLrg.truckReg,
            fleet: this.truckLrg.truckFleet,
            fleetNo: this.truckLrg.truckFleetNo,
            status: 'Pending',
            inspection: this.truckLrg.type
          };
          this.afs.collection('deviations').doc(devs.key).set(devs);
        }
      }
      this.truckLrg.progress = this.truckLrg.progress / 21;
      console.log(this.truckLrg.progress)
      this.afs.collection('inspections').doc(this.truckLrg.key).update(this.truckLrg);
      if (this.truckLrg.progress === 0) {
        var status = 'In Queue';
      } else if (this.truckLrg.progress > 0 && this.truckLrg.progress < 1) {
        var status = 'In Progress';
      } else if (this.truckLrg.progress === 1) {
        var status = 'Completed';
      }
      this.afs.collection('trucks').doc(this.truckLrg.truckReg).update({
        workshopStatus: status,
        workshopProgress: this.truckLrg.progress,
        timeStamp: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD, HH:mm'),
        lastInspection: 'Workshop',
        lastInspectionTimestamp: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD, HH:mm'),
      });
    }
  }

  check() {

    if (this.optionA2 === true && this.deviations.note1 === '') {
      return this.devMsg('Check oil levels')
    }
    if (this.optionB2 === true && this.deviations.note2 === '') {
      return this.devMsg('Check coolant levels')
    }
    if (this.optionC2 === true && this.deviations.note3 === '') {
      return this.devMsg('Check lights')
    }

    if (this.checkType === 'Small') {
      if (this.truckSml.jobNo !== '') {
        if (this.optionA1 === true || this.optionA2 === true) {
          if (this.optionB1 === true || this.optionB2 === true) {
            if (this.optionC1 === true || this.optionC2 === true) {
              if (this.truckSml.controllerSig !== '') {
                return this.save()
              } else {
                this.alertMsg('Signature')
              }
            } else {
              this.alertMsg('Check lights')
            }
          } else {
            this.alertMsg('Check coolant level')
          }
        } else {
          this.alertMsg('Check oil level')
        }
      } else {
        this.alertMsg('Job Card Number')
      }
    } else if (this.checkType === 'Medium') {

      if (this.optionA2 === true && this.deviations.note1 === '') {
        return this.devMsg('Check engine water/oil leaks')
      }
      if (this.optionB2 === true && this.deviations.note2 === '') {
        return this.devMsg('Check Gearbox oil leaks')
      }
      if (this.optionC2 === true && this.deviations.note3 === '') {
        return this.devMsg('Check propshafts play')
      }
      if (this.optionD2 === true && this.deviations.note4 === '') {
        return this.devMsg('Check spring packs/Air bags')
      }
      if (this.optionE2 === true && this.deviations.note5 === '') {
        return this.devMsg('Check Brakes')
      }
      if (this.optionF2 === true && this.deviations.note6 === '') {
        return this.devMsg('Check engine oil and coolant level')
      }
      if (this.optionG2 === true && this.deviations.note7 === '') {
        return this.devMsg('Check Windscreen, windows and mirrors')
      }
      if (this.optionH2 === true && this.deviations.note8 === '') {
        return this.devMsg('Check licence disc validity')
      }
      if (this.optionI2 === true && this.deviations.note9 === '') {
        return this.devMsg('Check reported defects')
      }
      if (this.optionJ2 === true && this.deviations.note10 === '') {
        return this.devMsg('Check Lights')
      }

      if (this.truckMid.jobNo !== '') {
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
                            if (this.truckMid.controllerSig !== '') {
                              return this.save()
                            } else {
                              this.alertMsg('Signature')
                            }
                          } else {
                            this.alertMsg('Check Lights')
                          }
                        } else {
                          this.alertMsg('Check reported defects')
                        }
                      } else {
                        this.alertMsg('Check licence disc validity')
                      }
                    } else {
                      this.alertMsg('Check Windscreen, windows and mirrors')
                    }
                  } else {
                    this.alertMsg('Check engine oil and coolant level')
                  }
                } else {
                  this.alertMsg('Check Brakes')
                }
              } else {
                this.alertMsg('Check spring packs/Air bags')
              }
            } else {
              this.alertMsg('Check propshafts play')
            }
          } else {
            this.alertMsg('Check Gearbox oil leaks')
          }
        } else {
          this.alertMsg('Check engine water/oil leaks')
        }
      } else {
        this.alertMsg('Job Card Number')
      }
    } else {

      if (this.optionA2 === true && this.deviations.note1 === '') {
        return this.devMsg('Check radiator and water pipes for leaks and damage')
      }
      if (this.optionB2 === true && this.deviations.note2 === '') {
        return this.devMsg('Check engine for oil and water leaks')
      }
      if (this.optionC2 === true && this.deviations.note3 === '') {
        return this.devMsg('Check bellhousing if secure')
      }
      if (this.optionD2 === true && this.deviations.note4 === '') {
        return this.devMsg('Check gearbox for leaks')
      }
      if (this.optionE2 === true && this.deviations.note5 === '') {
        return this.devMsg('Check propshafts if secure and excessive play')
      }
      if (this.optionF2 === true && this.deviations.note6 === '') {
        return this.devMsg('Check suspension if secure (U-Bolts etc.)')
      }
      if (this.optionG2 === true && this.deviations.note7 === '') {
        return this.devMsg('Check tyre wear and torque arms')
      }
      if (this.optionH2 === true && this.deviations.note8 === '') {
        return this.devMsg('Check air valves/air bags for leaks')
      }
      if (this.optionI2 === true && this.deviations.note9 === '') {
        return this.devMsg('Check brake shoes/pads and state percentage of life used')
      }
      if (this.optionJ2 === true && this.deviations.note10 === '') {
        return this.devMsg('Check diffs/hubs for oil leaks')
      }
      if (this.optionK2 === true && this.deviations.note11 === '') {
        return this.devMsg('Check engine oil level')
      }
      if (this.optionL2 === true && this.deviations.note12 === '') {
        return this.devMsg('Check coolant level')
      }
      if (this.optionM2 === true && this.deviations.note13 === '') {
        return this.devMsg('Check other fluid levels and check all filler caps')
      }
      if (this.optionN2 === true && this.deviations.note14 === '') {
        return this.devMsg('Check windscreen for cracks and check wiper blades')
      }
      if (this.optionO2 === true && this.deviations.note15 === '') {
        return this.devMsg('Check licence disc validity')
      }
      if (this.optionP2 === true && this.deviations.note16 === '') {
        return this.devMsg('Check and attend to all reported defects')
      }
      if (this.optionQ2 === true && this.deviations.note17 === '') {
        return this.devMsg('Check all lights and indicators')
      }
      if (this.optionR2 === true && this.deviations.note18 === '') {
        return this.devMsg('Check reflectors and warning signs')
      }
      if (this.optionS2 === true && this.deviations.note19 === '') {
        return this.devMsg('Check battery terminals and check if batteries are secure')
      }
      if (this.optionT2 === true && this.deviations.note20 === '') {
        return this.devMsg('Check chevron/tail board')
      }

      if (this.truckLrg.jobNo !== '') {
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
                                    if (this.optionO1 === true || this.optionO2 === true) {
                                      if (this.optionP1 === true || this.optionP2 === true) {
                                        if (this.optionQ1 === true || this.optionQ2 === true) {
                                          if (this.optionR1 === true || this.optionR2 === true) {
                                            if (this.optionS1 === true || this.optionS2 === true) {
                                              if (this.optionT1 === true || this.optionT2 === true) {
                                                if (this.truckLrg.controllerSig !== '') {
                                                  return this.save()
                                                } else {
                                                  this.alertMsg('Signature')
                                                }
                                              } else {
                                                this.alertMsg('Check chevron/tail board')
                                              }
                                            } else {
                                              this.alertMsg('Check battery terminals and check if batteries are secure')
                                            }
                                          } else {
                                            this.alertMsg('Check reflectors and warning signs')
                                          }
                                        } else {
                                          this.alertMsg('Check all lights and indicators')
                                        }
                                      } else {
                                        this.alertMsg('Check and attend to all reported defects')
                                      }
                                    } else {
                                      this.alertMsg('Check licence disc validity')
                                    }
                                  } else {
                                    this.alertMsg('Check windscreen for cracks and check wiper blades')
                                  }
                                } else {
                                  this.alertMsg('Check other fluid levels and check all filler caps')
                                }
                              } else {
                                this.alertMsg('Check coolant level')
                              }
                            } else {
                              this.alertMsg('Check engine oil level')
                            }
                          } else {
                            this.alertMsg('Check diffs/hubs for oil leaks')
                          }
                        } else {
                          this.alertMsg('Check brake shoes/pads and state percentage of life used')
                        }
                      } else {
                        this.alertMsg('Check air valves/air bags for leaks')
                      }
                    } else {
                      this.alertMsg('Check tyre wear and torque arms')
                    }
                  } else {
                    this.alertMsg('Check suspension if secure (U-Bolts etc.)')
                  }
                } else {
                  this.alertMsg('Check propshafts if secure and excessive play')
                }
              } else {
                this.alertMsg('Check gearbox for leaks')
              }
            } else {
              this.alertMsg('Check bellhousing if secure')
            }
          } else {
            this.alertMsg('Check engine for oil and water leaks')
          }
        } else {
          this.alertMsg('Check radiator and water pipes for leaks and damage')
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
        this.truckSml.timeOut = moment(new Date().toISOString()).locale('en').format('HH:mm');
        this.truckSml.duration = moment(this.truckSml.timeOut, 'HH:mm').diff(moment(this.truckSml.timeIn, 'HH:mm'), 'minutes', true);

        // Save inspection
        this.update();
        this.setNewWorkshop();
        this.router.navigate(['home']);
        this.loading.dismiss();
      });
    }
    else if (this.checkType === 'Medium') {
      this.getDevMid();
      this.loading.present('Saving, Please wait...').then(() => {
        // Calculate time to complete inspection
        this.truckMid.timeOut = moment(new Date().toISOString()).locale('en').format('HH:mm');
        this.truckMid.duration = moment(this.truckMid.timeOut, 'HH:mm').diff(moment(this.truckMid.timeIn, 'HH:mm'), 'minutes', true);

        // Save inspection
        this.update();
        this.setNewWorkshop();
        this.router.navigate(['home']);
        this.loading.dismiss();
      });
    } else {
      this.getDevLrg();
      this.loading.present('Saving, Please wait...').then(() => {
        // Calculate time to complete inspection
        this.truckLrg.timeOut = moment(new Date().toISOString()).locale('en').format('HH:mm');
        this.truckLrg.duration = moment(this.truckLrg.timeOut, 'HH:mm').diff(moment(this.truckLrg.timeIn, 'HH:mm'), 'minutes', true);

        // Save inspection
        this.update();
        this.setNewWorkshop();
        this.router.navigate(['home']);
        this.loading.dismiss();
      });
    }
  }

  setNewWorkshop() {
    if (this.checkType === 'Small') {
      this.afs.collection('newWorkshop').doc(this.truckSml.key).set(this.truckSml);
    } else if (this.checkType === 'Medium') {
      this.afs.collection('newWorkshop').doc(this.truckMid.key).set(this.truckMid);
    } else {
      this.afs.collection('newWorkshop').doc(this.truckLrg.key).set(this.truckLrg);
    }
  }

  getDevSml() {
    this.truckSml.oil = this.optionA1;
    this.truckSml.coolant = this.optionB1;
    this.truckSml.lights = this.optionC1;
    if (this.deviations.note1 !== '') {
      this.truckSml.deviations.push({ item: 'Check oil level', note: this.deviations.note1, photo: this.deviations.photo1 })
    }
    if (this.deviations.note2 !== '') {
      this.truckSml.deviations.push({ item: 'Check coolant level', note: this.deviations.note2, photo: this.deviations.photo2 })
    }
    if (this.deviations.note3 !== '') {
      this.truckSml.deviations.push({ item: 'Check lights', note: this.deviations.note3, photo: this.deviations.photo3 })
    }
  }

  getDevMid() {
    this.truckMid.engine = this.optionA1;
    this.truckMid.gearbox = this.optionB1;
    this.truckMid.propshafts = this.optionC1;
    this.truckMid.airbags = this.optionD1;
    this.truckMid.brakes = this.optionE1;
    this.truckMid.coolant = this.optionF1;
    this.truckMid.windscreen = this.optionG1;
    this.truckMid.licence = this.optionH1;
    this.truckMid.defects = this.optionI1;
    this.truckMid.lights = this.optionJ1;

    if (this.deviations.note1 !== '') {
      this.truckMid.deviations.push({ item: 'Check engine water/oil leaks', note: this.deviations.note1, photo: this.deviations.photo1 })
    }
    if (this.deviations.note2 !== '') {
      this.truckMid.deviations.push({ item: 'Check Gearbox oil leaks', note: this.deviations.note2, photo: this.deviations.photo2 })
    }
    if (this.deviations.note3 !== '') {
      this.truckMid.deviations.push({ item: 'Check propshafts play', note: this.deviations.note3, photo: this.deviations.photo3 })
    }
    if (this.deviations.note4 !== '') {
      this.truckMid.deviations.push({ item: 'Check spring packs/Air bags', note: this.deviations.note4, photo: this.deviations.photo4 })
    }
    if (this.deviations.note5 !== '') {
      this.truckMid.deviations.push({ item: 'Check Brakes', note: this.deviations.note5, photo: this.deviations.photo5 })
    }
    if (this.deviations.note6 !== '') {
      this.truckMid.deviations.push({ item: 'Check engine oil and coolant level', note: this.deviations.note6, photo: this.deviations.photo6 })
    }
    if (this.deviations.note7 !== '') {
      this.truckMid.deviations.push({ item: '', note: this.deviations.note7, photo: this.deviations.photo7 })
    }
    if (this.deviations.note8 !== '') {
      this.truckMid.deviations.push({ item: 'Check licence disc validity', note: this.deviations.note8, photo: this.deviations.photo8 })
    }
    if (this.deviations.note9 !== '') {
      this.truckMid.deviations.push({ item: 'Check reported defects', note: this.deviations.note9, photo: this.deviations.photo9 })
    }
    if (this.deviations.note10 !== '') {
      this.truckMid.deviations.push({ item: 'Check Lights', note: this.deviations.note10, photo: this.deviations.photo10 })
    }
  }

  getDevLrg() {
    this.truckLrg.radiator = this.optionA1;
    this.truckLrg.engine = this.optionB1;
    this.truckLrg.bellhousing = this.optionC1;
    this.truckLrg.gearbox = this.optionD1;
    this.truckLrg.propshafts = this.optionE1;
    this.truckLrg.suspension = this.optionF1;
    this.truckLrg.tyre = this.optionG1;
    this.truckLrg.airbags = this.optionH1;
    this.truckLrg.brakes = this.optionI1;
    this.truckLrg.diffs = this.optionJ1;
    this.truckLrg.extOil = this.optionK1;
    this.truckLrg.extCoolant = this.optionL1;
    this.truckLrg.fluid = this.optionM1;
    this.truckLrg.windscreen = this.optionN1;
    this.truckLrg.licence = this.optionO1;
    this.truckLrg.defects = this.optionP1;
    this.truckLrg.lights = this.optionQ1;
    this.truckLrg.reflectors = this.optionR1;
    this.truckLrg.battery = this.optionS1;
    this.truckLrg.chevron = this.optionT1;

    if (this.deviations.note1 !== '') {
      this.truckLrg.deviations.push({ item: 'Check radiator and water pipes for leaks and damage', note: this.deviations.note1, photo: this.deviations.photo1 })
    }
    if (this.deviations.note2 !== '') {
      this.truckLrg.deviations.push({ item: 'Check engine for oil and water leaks', note: this.deviations.note2, photo: this.deviations.photo2 })
    }
    if (this.deviations.note3 !== '') {
      this.truckLrg.deviations.push({ item: 'Check bellhousing if secure', note: this.deviations.note3, photo: this.deviations.photo3 })
    }
    if (this.deviations.note4 !== '') {
      this.truckLrg.deviations.push({ item: 'Check gearbox for leaks', note: this.deviations.note4, photo: this.deviations.photo4 })
    }
    if (this.deviations.note5 !== '') {
      this.truckLrg.deviations.push({ item: 'Check propshafts if secure and excessive play', note: this.deviations.note5, photo: this.deviations.photo5 })
    }
    if (this.deviations.note6 !== '') {
      this.truckLrg.deviations.push({ item: 'Check suspension if secure (U-Bolts etc.)', note: this.deviations.note6, photo: this.deviations.photo6 })
    }
    if (this.deviations.note7 !== '') {
      this.truckLrg.deviations.push({ item: 'Check tyre wear and torque arms', note: this.deviations.note7, photo: this.deviations.photo7 })
    }
    if (this.deviations.note8 !== '') {
      this.truckLrg.deviations.push({ item: 'Check air valves/air bags for leaks', note: this.deviations.note8, photo: this.deviations.photo8 })
    }
    if (this.deviations.note9 !== '') {
      this.truckLrg.deviations.push({ item: 'Check brake shoes/pads and state percentage of life used', note: this.deviations.note9, photo: this.deviations.photo9 })
    }
    if (this.deviations.note10 !== '') {
      this.truckLrg.deviations.push({ item: 'Check diffs/hubs for oil leaks', note: this.deviations.note10, photo: this.deviations.photo10 })
    }
    if (this.deviations.note11 !== '') {
      this.truckLrg.deviations.push({ item: 'Check engine oil level', note: this.deviations.note11, photo: this.deviations.photo11 })
    }
    if (this.deviations.note12 !== '') {
      this.truckLrg.deviations.push({ item: 'Check coolant level', note: this.deviations.note12, photo: this.deviations.photo12 })
    }
    if (this.deviations.note13 !== '') {
      this.truckLrg.deviations.push({ item: 'Check other fluid levels and check all filler caps', note: this.deviations.note13, photo: this.deviations.photo13 })
    }
    if (this.deviations.note14 !== '') {
      this.truckLrg.deviations.push({ item: 'Check windscreen for cracks and check wiper blades', note: this.deviations.note14, photo: this.deviations.photo14 })
    }
    if (this.deviations.note15 !== '') {
      this.truckLrg.deviations.push({ item: 'Check licence disc validity', note: this.deviations.note15, photo: this.deviations.photo15 })
    }
    if (this.deviations.note16 !== '') {
      this.truckLrg.deviations.push({ item: 'Check and attend to all reported defects', note: this.deviations.note16, photo: this.deviations.photo16 })
    }
    if (this.deviations.note17 !== '') {
      this.truckLrg.deviations.push({ item: 'Check all lights and indicators', note: this.deviations.note17, photo: this.deviations.photo17 })
    }
    if (this.deviations.note18 !== '') {
      this.truckLrg.deviations.push({ item: 'Check reflectors and warning signs', note: this.deviations.note18, photo: this.deviations.photo18 })
    }
    if (this.deviations.note19 !== '') {
      this.truckLrg.deviations.push({ item: 'Check battery terminals and check if batteries are secure', note: this.deviations.note19, photo: this.deviations.photo19 })
    }
    if (this.deviations.note20 !== '') {
      this.truckLrg.deviations.push({ item: 'Check chevron/tail board', note: this.deviations.note20, photo: this.deviations.photo20 })
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
        this.afs.collection('inspections').doc(this.truckSml.key).delete();
        this.afs.collection('trucks').doc(this.truckSml.code).update({ workshopStatus: 'Skipped', workshopProgress: 0 });
      } else if (this.checkType === 'Medium') {
        this.afs.collection('inspections').doc(this.truckMid.key).delete();
        this.afs.collection('trucks').doc(this.truckMid.code).update({ workshopStatus: 'Skipped', workshopProgress: 0 });
      } else if (this.checkType === 'Large') {
        this.afs.collection('inspections').doc(this.truckLrg.key).delete();
        this.afs.collection('trucks').doc(this.truckLrg.code).update({ workshopStatus: 'Skipped', workshopProgress: 0 });
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

