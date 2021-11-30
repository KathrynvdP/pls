import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TyrebayInspectionPageRoutingModule } from './tyrebay-inspection-routing.module';
import { TyrebayInspectionPage } from './tyrebay-inspection.page';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicSelectableModule,
    TyrebayInspectionPageRoutingModule
  ],
  declarations: [TyrebayInspectionPage]
})
export class TyrebayInspectionPageModule {}
