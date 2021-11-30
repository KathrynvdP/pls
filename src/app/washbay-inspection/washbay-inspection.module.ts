import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WashbayInspectionPageRoutingModule } from './washbay-inspection-routing.module';

import { WashbayInspectionPage } from './washbay-inspection.page';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicSelectableModule,
    WashbayInspectionPageRoutingModule
  ],
  declarations: [WashbayInspectionPage]
})
export class WashbayInspectionPageModule {}
