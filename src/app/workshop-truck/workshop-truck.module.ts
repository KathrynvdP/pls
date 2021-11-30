import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { WorkshopTruckPageRoutingModule } from './workshop-truck-routing.module';
import { WorkshopTruckPage } from './workshop-truck.page';
import { SignaturePadModule } from 'angular2-signaturepad';

@NgModule({
  imports: [
    SignaturePadModule,
    CommonModule,
    FormsModule,
    IonicModule,
    WorkshopTruckPageRoutingModule
  ],
  declarations: [WorkshopTruckPage]
})
export class WorkshopTruckPageModule {}
