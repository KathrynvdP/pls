import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, AlertController, NavParams, PopoverController, ToastController } from '@ionic/angular';
import { LoadingService } from '../services/loading.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Observable } from 'rxjs';
import { ToastService } from '../services/toast.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {

  params;
  notes = [];
  selectedNote;

  @ViewChild('imageChooser', { static: false }) filePickerRef: ElementRef<HTMLInputElement>;
  downloadURL: Observable<string | null>;

  constructor(private router: Router,
    public popCtlr: PopoverController,
    private navParams: NavParams,
    private actionSheetController: ActionSheetController,
    public camera: Camera,
    private loading: LoadingService,
    private afStorage: AngularFireStorage, private afs: AngularFirestore
  ) {
    this.params = navParams.data;
  }

  ngOnInit() {
    this.notes = this.params.notes;
    console.log(this.notes)
  }

  ionViewwillLeave() {
    this.popCtlr.dismiss(true)
  }

  async upload(note) {
    this.selectedNote = note;
    const actionSheet = await this.actionSheetController.create({
      mode: 'ios',
      header: 'Image Source',
      buttons: [{
        text: 'Camera',
        icon: 'camera',
        handler: () => {
          this.takePicture(note);
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

  async takePicture(note) {
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
      let photo = this.afStorage.ref(`/orders/${this.selectedNote.delNote}.jpeg`);

      photo.putString(imageData, 'base64', metadata).then(snapshot => {
        const ref = this.afStorage.ref(`/orders/${this.selectedNote.delNote}.jpeg`);
        this.downloadURL = ref.getDownloadURL();
        this.downloadURL.subscribe(url => {
          if (url) {
            this.selectedNote.pod = url;
            this.afs.collection('delivery-notes').doc(this.selectedNote.key).update({ pod: url });
            this.loading.dismiss();
            this.popCtlr.dismiss(this.selectedNote)
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

      const filePath = `/orders/${this.selectedNote.delNote}`;
      const fileRef = this.afStorage.ref(filePath);
      const task = this.afStorage.upload(filePath, file);

      // get notified when the download URL is available
      task.snapshotChanges().pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe(url => {
            if (url) {
              this.selectedNote.pod = url;
              console.log(this.selectedNote.pod)
              this.afs.collection('delivery-notes').doc(this.selectedNote.key).update({ pod: url });
              this.loading.dismiss();
              this.popCtlr.dismiss(this.selectedNote)
            }
          })
        })
      ).subscribe()

    };
    reader.readAsDataURL(file);
  }

}

