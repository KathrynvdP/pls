import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FuelRecordPageRoutingModule } from './fuel-record-routing.module';
import { FuelRecordPage } from './fuel-record.page';
import { IonicSelectableModule } from 'ionic-selectable';
import { ImageCropperModule } from 'ngx-image-cropper';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FuelRecordPageRoutingModule,
    IonicSelectableModule,
    ImageCropperModule
  ],
  declarations: [FuelRecordPage]
})
export class FuelRecordPageModule {}
