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
  selector: 'app-tyrebay-truck',
  templateUrl: './tyrebay-truck.page.html',
  styleUrls: ['./tyrebay-truck.page.scss'],
})
export class TyrebayTruckPage implements OnInit {

  saved = false;

  code;
  type;
  checkType;

  truckSml = {
    type: 'tyrebay', report: 'Tyrebay Check', key: '', code: '', date: '', timeIn: '', timeOut: '', duration: {}, truckReg: '', truckFleet: '', truckFleetNo: '', checkType: '', jobNo: '',
    controller: '', controllerSig: '', // mechanic: '', mechanicSig: '', foreman: '', foremanSig: '',
    cap: false, ext: false, condition: '', pipe: false, progress: 0, deviations: [],
  };

  truckMid = {
    type: 'tyrebay', report: 'Tyrebay Check', key: '', code: '', date: '', timeIn: '', timeOut: '', duration: {}, truckReg: '', truckFleet: '', truckFleetNo: '', checkType: '', jobNo: '',
    controller: '', controllerSig: '', // mechanic: '', mechanicSig: '', foreman: '', foremanSig: '',
    cap: false, ext: false, torqued: false, condition: '', pipe: false, notes: '', progress: 0, deviations: [],
  };

  truckLrg = {
    type: 'tyrebay', report: 'Tyrebay Check', key: '', code: '', date: '', timeIn: '', timeOut: '', duration: {}, truckReg: '', truckFleet: '', truckFleetNo: '', checkType: '', jobNo: '',
    controller: '', controllerSig: '', // mechanic: '', mechanicSig: '', foreman: '', foremanSig: '',
    cap: false, ext: false, torqued: false, condition: '', tool: false, branding: false, rims: false, notes: '', progress: 0, deviations: [],
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

  //isDrawing1 = true;
  isDrawing2 = true;
  //isDrawing3 = true;

  signaturePadOptions: Object = {
    minWidth: 2,
    backgroundColor: '#fff',
    penColor: '#000',
    canvasWidth: 250
  };

  deviations = {
    note1: '', note2: '', note3: '', note4: '', note5: '', note6: '', note7: '', note8: '', note9: '', note10: '',
    photo1: '', photo2: '', photo3: '', photo4: '', photo5: '', photo6: '', photo7: '', photo8: '', photo9: '', photo10: '',
  }

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

  loadActive = false;

  editMode;

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

  constructor(public activatedRoute: ActivatedRoute, private storage: Storage, private afs: AngularFirestore, private afStorage: AngularFireStorage, public camera: Camera,
    public alertCtrl: AlertController, public loading: LoadingService, public router: Router, public actionSheetController: ActionSheetController, public toast: ToastService,) { }

  ngOnInit() {
    this.code = this.activatedRoute.snapshot.paramMap.get('id1');
    this.type = this.activatedRoute.snapshot.paramMap.get('id2');
    this.checkType = this.activatedRoute.snapshot.paramMap.get('id3');
    this.editMode = this.activatedRoute.snapshot.paramMap.get('edit');
    this.afs.collection('trucks').doc(this.code).ref.get().then(truck => {
      if (this.editMode !== 'true') {
        this.startInspection(truck);
      } else {
        this.collectInspection(truck);
      }
    })
  }

  collectInspection(truck) {
    this.afs.collection('inspections').ref.where('code', '==', this.code).where('jobNo', '==', truck.data().jobNo).where('type', '==', 'tyrebay').limit(1).get().then(docs => {
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
      if (this.truckSml.condition !== '') {
        this.truckSml.progress = this.truckSml.progress + 1;
        if (this.truckSml.condition === '25%') {
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
      if (this.optionD1 === true || this.optionD2 === true) {
        this.truckSml.progress = this.truckSml.progress + 1;
        if (this.optionD2 === true) {
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
      this.truckSml.progress = this.truckSml.progress / 5;
      this.afs.collection('inspections').doc(this.truckSml.key).update(this.truckSml);
      if (this.truckSml.progress === 0) {
        var status = 'In Queue';
      } else if (this.truckSml.progress > 0 && this.truckSml.progress < 1) {
        var status = 'In Progress';
      } else if (this.truckSml.progress === 1) {
        var status = 'Completed';
      }
      this.afs.collection('trucks').doc(this.truckSml.truckReg).update({
        tyrebayStatus: status,
        tyrebayProgress: this.truckSml.progress,
        timeStamp: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD, HH:mm'),
        lastInspection: 'TyreBay',
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
      if (this.truckMid.condition !== '') {
        this.truckMid.progress = this.truckMid.progress + 1;
        if (this.truckMid.condition === '25%') {
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
      this.truckMid.progress = this.truckMid.progress / 6;
      this.afs.collection('inspections').doc(this.truckMid.key).update(this.truckMid);
      if (this.truckMid.progress === 0) {
        var status = 'In Queue';
      } else if (this.truckMid.progress > 0 && this.truckMid.progress < 1) {
        var status = 'In Progress';
      } else if (this.truckMid.progress === 1) {
        var status = 'Completed';
      }
      this.afs.collection('trucks').doc(this.truckMid.truckReg).update({
        tyrebayStatus: status,
        tyrebayProgress: this.truckMid.progress,
        timeStamp: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD, HH:mm'),
        lastInspection: 'TyreBay',
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
      if (this.truckLrg.condition !== '') {
        this.truckLrg.progress = this.truckLrg.progress + 1;
        if (this.truckLrg.condition === '25%') {
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
      this.truckLrg.progress = this.truckLrg.progress / 8;
      this.afs.collection('inspections').doc(this.truckLrg.key).update(this.truckLrg);
      if (this.truckLrg.progress === 0) {
        var status = 'In Queue';
      } else if (this.truckLrg.progress > 0 && this.truckLrg.progress < 1) {
        var status = 'In Progress';
      } else if (this.truckLrg.progress === 1) {
        var status = 'Completed';
      }
      this.afs.collection('trucks').doc(this.truckLrg.truckReg).update({
        tyrebayStatus: status,
        tyrebayProgress: this.truckLrg.progress,
        timeStamp: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD, HH:mm'),
        lastInspection: 'TyreBay',
        lastInspectionTimestamp: moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD, HH:mm'),
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
      if (this.truckSml.condition === '25%' && this.deviations.note3 === '') {
        return this.devMsg('Condition')
      }
      if (this.optionD2 === true && this.deviations.note4 === '') {
        return this.devMsg('Check Tyre with a pipe')
      }

      if (this.truckSml.jobNo !== '') {
        if (this.optionA1 === true || this.optionA2 === true) {
          if (this.optionB1 === true || this.optionB2 === true) {
            if (this.truckSml.condition !== '') {
              if (this.optionD1 === true || this.optionD2 === true) {
                if (this.truckSml.controllerSig !== '') {
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
      if (this.truckMid.condition === '25%' && this.deviations.note4 === '') {
        return this.devMsg('Condition')
      }
      if (this.optionE2 === true && this.deviations.note5 === '') {
        return this.devMsg('Check Tyre with a pipe')
      }

      if (this.truckMid.jobNo !== '') {
        if (this.optionA1 === true || this.optionA2 === true) {
          if (this.optionB1 === true || this.optionB2 === true) {
            if (this.optionC1 === true || this.optionC2 === true) {
              if (this.truckMid.condition !== '') {
                if (this.optionE1 === true || this.optionE2 === true) {
                  if (this.truckMid.controllerSig !== '') {
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
      if (this.truckLrg.condition === '25%' && this.deviations.note4 === '') {
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

      if (this.truckLrg.jobNo !== '') {
        if (this.optionA1 === true || this.optionA2 === true) {
          if (this.optionB1 === true || this.optionB2 === true) {
            if (this.optionC1 === true || this.optionC2 === true) {
              if (this.truckLrg.condition !== '') {
                if (this.optionE1 === true || this.optionE2 === true) {
                  if (this.optionF1 === true || this.optionF2 === true) {
                    if (this.optionG1 === true || this.optionG2 === true) {
                      if (this.truckLrg.controllerSig !== '') {
                        return this.save()
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
      this.getDevSml()
      this.loading.present('Saving, Please wait...').then(() => {
        // Calculate time to complete inspection
        this.truckSml.timeOut = moment(new Date().toISOString()).locale('en').format('HH:mm');
        this.truckSml.duration = moment(this.truckSml.timeOut, 'HH:mm').diff(moment(this.truckSml.timeIn, 'HH:mm'), 'minutes', true);

        // Save inspection
        this.afs.collection('inspections').doc(this.truckSml.key).update(this.truckSml);
        this.router.navigate(['home']);
        this.loading.dismiss();
      });
    }
    else if (this.checkType === 'Medium') {
      this.getDevMid()
      this.loading.present('Saving, Please wait...').then(() => {
        // Calculate time to complete inspection
        this.truckMid.timeOut = moment(new Date().toISOString()).locale('en').format('HH:mm');
        this.truckMid.duration = moment(this.truckMid.timeOut, 'HH:mm').diff(moment(this.truckMid.timeIn, 'HH:mm'), 'minutes', true);

        // Save inspection
        this.afs.collection('inspections').doc(this.truckMid.key).update(this.truckMid);
        this.router.navigate(['home']);
        this.loading.dismiss();
      })
    } else {
      this.getDevLrg()
      this.loading.present('Saving, Please wait...').then(() => {
        // Calculate time to complete inspection
        this.truckLrg.timeOut = moment(new Date().toISOString()).locale('en').format('HH:mm');
        this.truckLrg.duration = moment(this.truckLrg.timeOut, 'HH:mm').diff(moment(this.truckLrg.timeIn, 'HH:mm'), 'minutes', true);

        // Save inspection
        this.afs.collection('inspections').doc(this.truckLrg.key).update(this.truckLrg);
        this.router.navigate(['home']);
        this.loading.dismiss();
      });
    }
  }

  getDevSml() {
    this.truckSml.cap = this.optionA1;
    this.truckSml.ext = this.optionB1;
    // this.truckSml.condition = this.optionC1;
    this.truckSml.pipe = this.optionD1;
    if (this.deviations.note1 !== '') {
      this.truckSml.deviations.push({ item: 'Valve Cap', note: this.deviations.note1, photo: this.deviations.photo1 })
    }
    if (this.deviations.note2 !== '') {
      this.truckSml.deviations.push({ item: 'Valve Ext', note: this.deviations.note2, photo: this.deviations.photo2 })
    }
    if (this.deviations.note3 !== '') {
      this.truckSml.deviations.push({ item: 'Condition', note: this.deviations.note3, photo: this.deviations.photo3 })
    }
    if (this.deviations.note4 !== '') {
      this.truckSml.deviations.push({ item: 'Check Tyres with a pipe', note: this.deviations.note4, photo: this.deviations.photo4 })
    }
  }

  getDevMid() {
    this.truckMid.cap = this.optionA1;
    this.truckMid.ext = this.optionB1;
    this.truckMid.torqued = this.optionC1;
    // this.truckMid.condition = this.optionD1;
    this.truckMid.pipe = this.optionE1;

    if (this.deviations.note1 !== '') {
      this.truckMid.deviations.push({ item: 'Valve Cap', note: this.deviations.note1, photo: this.deviations.photo1 })
    }
    if (this.deviations.note2 !== '') {
      this.truckMid.deviations.push({ item: 'Valve Ext', note: this.deviations.note2, photo: this.deviations.photo2 })
    }
    if (this.deviations.note3 !== '') {
      this.truckMid.deviations.push({ item: 'Torqued', note: this.deviations.note3, photo: this.deviations.photo3 })
    }
    if (this.deviations.note4 !== '') {
      this.truckMid.deviations.push({ item: 'Condition', note: this.deviations.note4, photo: this.deviations.photo4 })
    }
    if (this.deviations.note5 !== '') {
      this.truckMid.deviations.push({ item: 'Check Tyres with a pipe', note: this.deviations.note5, photo: this.deviations.photo5 })
    }
  }

  getDevLrg() {
    this.truckLrg.cap = this.optionA1;
    this.truckLrg.ext = this.optionB1;
    this.truckLrg.torqued = this.optionC1;
    // this.truckLrg.condition = this.optionD1;
    this.truckLrg.tool = this.optionE1;
    this.truckLrg.branding = this.optionF1;
    this.truckLrg.rims = this.optionG1;

    if (this.deviations.note1 !== '') {
      this.truckLrg.deviations.push({ item: 'Valve Cap', note: this.deviations.note1, photo: this.deviations.photo1 })
    }
    if (this.deviations.note2 !== '') {
      this.truckLrg.deviations.push({ item: 'Valve Ext', note: this.deviations.note2, photo: this.deviations.photo2 })
    }
    if (this.deviations.note3 !== '') {
      this.truckLrg.deviations.push({ item: 'Torqued', note: this.deviations.note3, photo: this.deviations.photo3 })
    }
    if (this.deviations.note4 !== '') {
      this.truckLrg.deviations.push({ item: 'Condtion', note: this.deviations.note4, photo: this.deviations.photo4 })
    }
    if (this.deviations.note5 !== '') {
      this.truckLrg.deviations.push({ item: 'Electronic survey tool', note: this.deviations.note5, photo: this.deviations.photo5 })
    }
    if (this.deviations.note6 !== '') {
      this.truckLrg.deviations.push({ item: 'Branding of Tyres', note: this.deviations.note6, photo: this.deviations.photo6 })
    }
    if (this.deviations.note7 !== '') {
      this.truckLrg.deviations.push({ item: 'Spraying Rims', note: this.deviations.note7, photo: this.deviations.photo7 })
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

        let photo = this.afStorage.ref(`deviation/tyrebay/${key}.jpeg`);

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

        const filePath = `deviation/tyrebay/${key}`;
        const fileRef = this.afStorage.ref(filePath);
        const task = this.afStorage.upload(filePath, file);

        // get notified when the download URL is available
        task.snapshotChanges().pipe(
          finalize(() => {
            this.downloadURL = fileRef.getDownloadURL();
            this.downloadURL.subscribe(async url => {
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
        this.afs.collection('inspections').doc(this.truckSml.key).delete();
        this.afs.collection('trucks').doc(this.truckSml.code).update({ tyrebayStatus: 'Skipped', tyrebayProgress: 0 });
      } else if (this.checkType === 'Medium') {
        this.afs.collection('inspections').doc(this.truckMid.key).delete();
        this.afs.collection('trucks').doc(this.truckMid.code).update({ tyrebayStatus: 'Skipped', tyrebayProgress: 0 });
      } else if (this.checkType === 'Large') {
        this.afs.collection('inspections').doc(this.truckLrg.key).delete();
        this.afs.collection('trucks').doc(this.truckLrg.code).update({ tyrebayStatus: 'Skipped', tyrebayProgress: 0 });
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

