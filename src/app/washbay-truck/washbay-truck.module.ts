import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { WashbayTruckPageRoutingModule } from './washbay-truck-routing.module';
import { WashbayTruckPage } from './washbay-truck.page';
import { SignaturePadModule } from 'angular2-signaturepad';

@NgModule({
  imports: [
    SignaturePadModule,
    CommonModule,
    FormsModule,
    IonicModule,
    WashbayTruckPageRoutingModule
  ],
  declarations: [WashbayTruckPage]
})
export class WashbayTruckPageModule {}
