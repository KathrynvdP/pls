import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EquipmentScanPageRoutingModule } from './equipment-scan-routing.module';

import { EquipmentScanPage } from './equipment-scan.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EquipmentScanPageRoutingModule
  ],
  declarations: [EquipmentScanPage]
})
export class EquipmentScanPageModule {}
