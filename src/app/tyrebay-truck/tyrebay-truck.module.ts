import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TyrebayTruckPageRoutingModule } from './tyrebay-truck-routing.module';
import { TyrebayTruckPage } from './tyrebay-truck.page';
import { SignaturePadModule } from 'angular2-signaturepad';

@NgModule({
  imports: [
    SignaturePadModule,
    CommonModule,
    FormsModule,
    IonicModule,
    TyrebayTruckPageRoutingModule
  ],
  declarations: [TyrebayTruckPage]
})
export class TyrebayTruckPageModule {}
