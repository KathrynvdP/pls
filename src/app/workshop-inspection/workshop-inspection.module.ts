import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WorkshopInspectionPageRoutingModule } from './workshop-inspection-routing.module';

import { WorkshopInspectionPage } from './workshop-inspection.page';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicSelectableModule,
    WorkshopInspectionPageRoutingModule
  ],
  declarations: [WorkshopInspectionPage]
})
export class WorkshopInspectionPageModule {}
