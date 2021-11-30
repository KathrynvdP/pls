import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DieselbayInspectionPageRoutingModule } from './dieselbay-inspection-routing.module';
import { DieselbayInspectionPage } from './dieselbay-inspection.page';
import { SignaturePadModule } from 'angular2-signaturepad';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DieselbayInspectionPageRoutingModule,
    SignaturePadModule
  ],
  declarations: [DieselbayInspectionPage]
})
export class DieselbayInspectionPageModule {}
