import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EquipmentInspectionPageRoutingModule } from './equipment-inspection-routing.module';
import { EquipmentInspectionPage } from './equipment-inspection.page';
import { SignaturePadModule } from 'angular2-signaturepad';

@NgModule({
  imports: [
    SignaturePadModule,
    CommonModule,
    FormsModule,
    IonicModule,
    EquipmentInspectionPageRoutingModule
  ],
  declarations: [EquipmentInspectionPage]
})
export class EquipmentInspectionPageModule {}
