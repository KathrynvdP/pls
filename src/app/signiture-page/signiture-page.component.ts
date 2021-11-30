import { Component, OnInit, ViewChild, ViewChildren, Input, ElementRef } from '@angular/core';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActionSheetController, AlertController, ModalController, NavController, NavParams } from '@ionic/angular';
import { LoadingService } from '../services/loading.service';
import { ToastService } from '../services/toast.service';
import { Observable } from 'rxjs';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import moment from 'moment';

@Component({
  selector: 'app-signiture-page',
  templateUrl: './signiture-page.component.html',
  styleUrls: ['./signiture-page.component.scss'],
})
export class SigniturePageComponent implements OnInit {

  public signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
    minWidth: 2,
    backgroundColor: '#fff',
    penColor: '#000',
    canvasWidth: 250
  };
  constructor(
    private afs: AngularFirestore, private modalCtrl: ModalController,
    private nav: NavController, private navParams: NavParams,
    private loading: LoadingService, private camera: Camera, private alertCtrl: AlertController,
    private afStorage: AngularFireStorage,
    private toast: ToastService, private actionSheetController: ActionSheetController
  ) {
    this.params = navParams.data;
  }

  @ViewChild('imageChooser', { static: false }) filePickerRef: ElementRef<HTMLInputElement>;
  downloadURL: Observable<string | null>;
  isDrawing = false;
  @ViewChild('signatureCanvas1', { static: false }) signaturePad1: SignaturePad;
  @ViewChild('signatureCanvas2', { static: false }) signaturePad2: SignaturePad;
  @ViewChild('signatureCanvas3', { static: false }) signaturePad3: SignaturePad;

  option;
  signitureImage: string;
  note: any = {};
  params;
  customNotes: string = '';
  stock: any = [];
  driverSigniture: string = '';
  customerSigniture: string = '';
  storemenSigniture: string = '';
  gotAll = '';
  amount = 0;

  ngOnInit() {
    this.note = this.params.note;
    this.stock = this.note.stock;
  }

  drawComplete(sig: string, num) {
    this[sig + 'Signiture'] = this['signaturePad' + num].toDataURL();
  }

  drawStart(sig: string, num) {
    console.log('begin drawing');
  }

  clearPad(sig: string, num) {
    console.log(this[sig + 'Signiture'])
    this[sig + 'Signiture'] = ''
    this['signaturePad' + num].clear();
  }

  async upload() {
    const actionSheet = await this.actionSheetController.create({
      mode: 'ios',
      header: 'Image Source',
      buttons: [{
        text: 'Camera',
        icon: 'camera',
        handler: () => {
          this.takePicture();
        }
      },
      {
        text: 'Attachments',
        icon: 'attach-outline',
        handler: () => {
          this.filePickerRef.nativeElement.click();
        }
      }]
    });
    await actionSheet.present();
  }

  // Open Camera Option
  // Return Image as Base64 String

  async takePicture() {
    const options: CameraOptions = {
      quality: 90,
      targetWidth: 300,
      targetHeight: 300,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {

      this.loading.present('Uploading...');

      var metadata = {
        contentType: 'image/jpeg',
      }
      let photo = this.afStorage.ref(`/orders/${this.note.delNote}.jpeg`);

      photo.putString(imageData, 'base64', metadata).then(snapshot => {
        const ref = this.afStorage.ref(`/orders/${this.note.delNote}.jpeg`);
        this.downloadURL = ref.getDownloadURL();
        this.downloadURL.subscribe(url => {
          if (url) {
            this.note.pod = url;
            this.afs.collection('delivery-notes').doc(this.note.key).update({ pod: url });
            this.loading.dismiss();
          }
        })
      })
    })
  }

  // File selector
  // To do: Error msg on incorrect file type
  onChooseFile(event: Event, note) {
    const file = (event.target as HTMLInputElement).files[0];

    const reader = new FileReader();

    reader.onload = () => {

      this.loading.present('Uploading...');

      const filePath = `/orders/${this.note.delNote}`;
      const fileRef = this.afStorage.ref(filePath);
      const task = this.afStorage.upload(filePath, file);

      // get notified when the download URL is available
      task.snapshotChanges().pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe(url => {
            if (url) {
              this.note.pod = url;
              console.log(this.note.pod)
              this.afs.collection('delivery-notes').doc(this.note.key).update({ pod: url });
              this.loading.dismiss();
            }
          })
        })
      ).subscribe()

    };
    reader.readAsDataURL(file);
  }

  save() {
    if (this.option === 'upload') {
      if (this.note.pod !== '') {
        this.completeUpload()
      } else {
        this.alertMsg('Upload')
      }
    } else if (this.option === 'epod') {
      if (this.gotAll !== '') {
        if (this.driverSigniture !== '') {
          if (this.customerSigniture !== '') {
            if (this.storemenSigniture !== '') {
              this.completeEPOD();
            } else {
              this.alertMsg('Storeman Signature')
            }
          } else {
            this.alertMsg('Receiver Signature')
          }
        } else {
          this.alertMsg('Driver Signature')
        }
      } else {
        this.alertMsg('Received all')
      }
    }
  }

  completeUpload() {
    this.loading.present('Saving, Please Wait').then(() => {
      this.loading.dismiss().then(() => {
        this.toast.show('Upload saved')
        this.note.status = 'Complete';
        this.note.completedDate = moment(new Date()).format('YYYY/MM/DD HH:mm');
        this.afs.collection('orders').doc(this.note.key).set(this.note).then(() => {
          this.afs.collection('delivery-notes').doc(this.note.key).delete()
        })
        this.modalCtrl.dismiss(this.note);
      });
    });
  }

  completeEPOD() {
    this.loading.present('Saving, Please Wait').then(() => {
      var deliveryDetails = {
        customerSignature: this.customerSigniture,
        driverSignature: this.driverSigniture,
        storemenSignature: this.storemenSigniture,
        customNotes: this.customNotes,
        gotAll: this.gotAll,
        amount: this.amount
      }
      this.note.deliveryDetails = deliveryDetails;
      this.note.status = 'Complete';
      this.note.completedDate = moment(new Date()).format('YYYY/MM/DD HH:mm');
      this.afs.collection('orders').doc(this.note.key).set(this.note).then(() => {
        this.afs.collection('delivery-notes').doc(this.note.key).delete()
      })
      this.loading.dismiss().then(() => {
        this.modalCtrl.dismiss(this.note);
      })
    })
  }

  async alertMsg(msg) {
    const prompt = await this.alertCtrl.create({
      header: 'Incomplete Check',
      message: `Please complete the following checks before saving: ${msg}`,
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

  back() {
    this.modalCtrl.dismiss();
  }
}

/*
complete() {
    console.log(this.note);
    this.loading.present('Saving, Please Wait').then(() =>
    {
      this.pdfService.petProfile(this.note, false, this.customerSigniture, this.driverSigniture , this.storemenSigniture, this.customNotes).then((res: string) => {
        this.loading.dismiss().then(() => {
          this.toast.show('EPOD created and saved')
          this.saveDocument(res).then(() => {
            this.eventService.emitComplete(this.note.key, res);
            this.modalCtrl.dismiss();
          });
        });
      });
    });
  }

  saveDocument(url) {
    const promise = new Promise<void>((resolve, reject) => {
      this.afs.collection('delivery-notes').doc(this.note.key).update({ pod: url }).then(() => {
        resolve();
      })
    })
    return promise;

  }
  */
